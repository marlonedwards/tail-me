import { useState, useEffect, useCallback } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { MerkleClient } from "@merkletrade/ts-sdk";
import { MerkleClientConfig } from "@merkletrade/ts-sdk";
import type { Position as MerklePosition, PairState } from "@merkletrade/ts-sdk";
import { Aptos, Network, AptosConfig } from "@aptos-labs/ts-sdk";

interface MerklePositionWithPair extends MerklePosition {
  pair: string;
}

const Trading = () => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [merkle, setMerkle] = useState<MerkleClient | null>(null);
  const [positions, setPositions] = useState<MerklePositionWithPair[]>([]);
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [lastPriceUpdate, setLastPriceUpdate] = useState<string>('');
  const [orderAmount, setOrderAmount] = useState<string>('');
  const [collateral, setCollateral] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [usdcBalance, setUsdcBalance] = useState<bigint>(BigInt(0));
  const [statusMessage, setStatusMessage] = useState<string>('');

  const config = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(config);

  const sendTransaction = async (payload: any) => {
    if (!account) throw new Error("No account connected");
    
    const response = await signAndSubmitTransaction({
      sender: account.address,
      data: payload,
    });
    
    await aptos.waitForTransaction({ transactionHash: response.hash });
    return response;
  };

  const loadData = useCallback(async () => {
    if (!merkle || !account?.address) {
      console.log('Missing requirements:', { 
        hasMerkle: !!merkle, 
        hasAccount: !!account,
        address: account?.address 
      });
      return;
    }

    try {
      // Get USDC balance
      const balance = await merkle.getUsdcBalance({
        accountAddress: account.address as `0x${string}`,
      });
      setUsdcBalance(balance);

      // Get positions
      try {
        console.log('Fetching positions for address:', account.address);
        const merklePositions = await merkle.getPositions({
          address: account.address as `0x${string}`,
        });
        console.log('Raw positions:', merklePositions);
        
        const positionsWithPair = merklePositions.map(pos => ({
          ...pos,
          pair: 'BTC_USD'
        }));
        
        setPositions(positionsWithPair);
      } catch (error) {
        console.error('Position loading error:', error);
      }
    } catch (error) {
      console.error('Error in loadData:', error);
      setStatusMessage('Failed to load account data');
    }
  }, [merkle, account]);

  useEffect(() => {
    const initMerkle = async () => {
      try {
        const merkleConfig = await MerkleClientConfig.testnet();
        const merkleClient = new MerkleClient(merkleConfig);
        setMerkle(merkleClient);
        console.log("Merkle client initialized");

        const session = await merkleClient.connectWsApi();
        console.log("Connected to Websocket API");
        
        const priceFeed = session.subscribePriceFeed("BTC_USD");
        console.log("Subscribed to BTC_USD price feed");

        for await (const price of priceFeed) {
          const priceValue = Number(price.price) / 1e6;
          setBtcPrice(priceValue);
          setLastPriceUpdate(new Date().toLocaleTimeString());
        }
      } catch (error) {
        console.error("Initialization error:", error);
        setStatusMessage("Failed to initialize trading interface");
      }
    };

    initMerkle();
  }, []);

  useEffect(() => {
    if (account?.address && merkle) {
      loadData();
      const interval = setInterval(loadData, 10000);
      return () => clearInterval(interval);
    }
  }, [account, merkle, loadData]);

  const handlePlaceOrder = async (isLong: boolean) => {
    if (!merkle || !account?.address) {
      setStatusMessage('Please connect your wallet first');
      return;
    }

    if (!orderAmount || !collateral) {
      setStatusMessage('Please enter position size and collateral');
      return;
    }

    // Validate minimums
    if (parseFloat(orderAmount) < 300) {
      setStatusMessage('Minimum position size is 300 USDC');
      return;
    }

    if (parseFloat(collateral) < 5) {
      setStatusMessage('Minimum collateral is 5 USDC');
      return;
    }

    setIsLoading(true);
    setStatusMessage(`Placing ${isLong ? 'long' : 'short'} order...`);
    
    try {
      const sizeDelta = BigInt(Math.floor(parseFloat(orderAmount) * 1_000_000));
      const collateralDelta = BigInt(Math.floor(parseFloat(collateral) * 1_000_000));

      if (collateralDelta > usdcBalance) {
        throw new Error('Insufficient USDC balance');
      }

      const payload = merkle.payloads.placeMarketOrder({
        pair: 'BTC_USD',
        userAddress: account.address as `0x${string}`,
        sizeDelta,
        collateralDelta,
        isLong,
        isIncrease: true,
      });

      console.log('Submitting order...');
      const tx = await sendTransaction(payload);
      console.log('Transaction hash:', tx.hash);
      setStatusMessage('Order placed! Waiting for confirmation...');

      // Wait and retry position fetch
      for (let i = 0; i < 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        await loadData();
        console.log(`Checking positions attempt ${i + 1}`);
      }

      setOrderAmount('');
      setCollateral('');
      setStatusMessage('Position opened successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      setStatusMessage(error instanceof Error ? error.message : 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePosition = async (position: MerklePositionWithPair) => {
    if (!merkle || !account?.address) return;

    setIsLoading(true);
    setStatusMessage('Closing position...');
    try {
      const payload = merkle.payloads.placeMarketOrder({
        pair: position.pair,
        userAddress: account.address as `0x${string}`,
        sizeDelta: position.size,
        collateralDelta: position.collateral,
        isLong: position.isLong,
        isIncrease: false,
      });

      const tx = await sendTransaction(payload);
      console.log('Close position transaction:', tx.hash);
      setStatusMessage('Position closed successfully!');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      await loadData();
    } catch (error) {
      console.error('Error closing position:', error);
      setStatusMessage('Failed to close position');
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (value: bigint | number): string => {
    const numValue = typeof value === 'bigint' ? Number(value) / 1e6 : value;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numValue);
  };

  if (!account) {
    return <div className="text-white">Please connect your wallet to trade</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Merkle Trading Dashboard</h2>
        <div className="text-gray-300 space-y-2">
          <div className="flex justify-between items-center bg-gray-700 p-4 rounded">
            <div className="flex flex-col">
              <p className="text-2xl font-bold">
                BTC Price: ${btcPrice ? formatNumber(btcPrice) : 'Loading...'}
              </p>
              {lastPriceUpdate && (
                <p className="text-sm text-gray-400">Last update: {lastPriceUpdate}</p>
              )}
            </div>
          </div>
          <p className="text-lg">USDC Balance: ${formatNumber(usdcBalance)}</p>
          <button
            onClick={() => claimTestnetUSDC()}
            disabled={isLoading}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Claiming...' : 'Claim 10 Testnet USDC'}
          </button>
          {statusMessage && (
            <div className="bg-gray-700 p-3 rounded text-white">
              {statusMessage}
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Place Market Order</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">
              Position Size (USDC)
              <span className="text-sm text-gray-400 ml-2">(Min: 300 USDC)</span>
            </label>
            <input
              type="number"
              value={orderAmount}
              onChange={(e) => setOrderAmount(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded"
              placeholder="Enter position size"
              step="0.1"
              min="0"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">
              Collateral (USDC)
              <span className="text-sm text-gray-400 ml-2">(Min: 5 USDC)</span>
            </label>
            <input
              type="number"
              value={collateral}
              onChange={(e) => setCollateral(e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded"
              placeholder="Enter collateral amount"
              step="0.1"
              min="0"
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => handlePlaceOrder(true)}
              disabled={isLoading}
              className="flex-1 bg-green-600 text-white py-3 rounded text-lg font-bold hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : '🚀 LONG BTC'}
            </button>
            <button
              onClick={() => handlePlaceOrder(false)}
              disabled={isLoading}
              className="flex-1 bg-red-600 text-white py-3 rounded text-lg font-bold hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : '🔻 SHORT BTC'}
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Your Positions</h3>
        <div className="space-y-4">
          {positions.map((position, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white text-lg font-semibold">
                    {position.pair} {position.isLong ? '🚀 LONG' : '🔻 SHORT'}
                  </p>
                  <p className="text-gray-300">
                    Size: ${formatNumber(position.size)} | Collateral: ${formatNumber(position.collateral)}
                  </p>
                </div>
                <button
                  onClick={() => handleClosePosition(position)}
                  disabled={isLoading}
                  className="bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 disabled:opacity-50"
                >
                  {isLoading ? 'Closing...' : 'Close Position'}
                </button>
              </div>
            </div>
          ))}
          {positions.length === 0 && (
            <p className="text-gray-400">No open positions</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trading;