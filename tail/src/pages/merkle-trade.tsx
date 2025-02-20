import { useState } from 'react';
import { MerkleClient, MerkleClientConfig } from "@merkletrade/ts-sdk";
import {
  Account,
  Aptos,
  Ed25519PrivateKey,
  type InputEntryFunctionData,
  PrivateKey,
  PrivateKeyVariants,
} from "@aptos-labs/ts-sdk";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function TradingPage() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function executeTrade() {
    setLoading(true);
    setError(null);
    setStatus('Initializing...');

    try {
      // initialize clients
      const merkle = new MerkleClient(await MerkleClientConfig.testnet());
      const aptos = new Aptos(merkle.config.aptosConfig);

      // initialize account
      const PRIVATE_KEY = "APTOS-PRIVATE-KEY";

      const account = Account.fromPrivateKey({
        privateKey: new Ed25519PrivateKey(
          PrivateKey.formatPrivateKey(PRIVATE_KEY, PrivateKeyVariants.Ed25519),
        ),
      });

      async function sendTransaction(payload: InputEntryFunctionData) {
        const transaction = await aptos.transaction.build.simple({
          sender: account.accountAddress,
          data: payload,
        });
        const { hash } = await aptos.signAndSubmitTransaction({
          signer: account,
          transaction,
        });
        return await aptos.waitForTransaction({ transactionHash: hash });
      }

      // get usdc balance
      setStatus('Claiming testnet USDC...');
      const faucetPayload = merkle.payloads.testnetFaucetUSDC({
        amount: 10_000_000n,
      });
      const faucetTx = await sendTransaction(faucetPayload);
      setStatus(`Successfully claimed testnet USDC (tx hash: ${faucetTx.hash})`);

      const usdcBalance = await merkle.getUsdcBalance({
        accountAddress: account.accountAddress,
      });

      setStatus(`USDC Balance: ${Number(usdcBalance) / 1e6} USDC`);

      // place order
      setStatus('Placing market order...');
      const openPayload = merkle.payloads.placeMarketOrder({
        pair: "BTC_USD",
        userAddress: account.accountAddress.toString(), // Convert to string
        sizeDelta: 300_000_000n,
        collateralDelta: 5_000_000n,
        isLong: true,
        isIncrease: true,
      });

      const openTx = await sendTransaction(openPayload);
      setStatus(`Successfully placed open order (tx hash: ${openTx.hash})`);

      await sleep(2_000);

      // get list of open positions & find BTC_USD position
      setStatus('Fetching positions...');
      const positions = await merkle.getPositions({
        address: account.accountAddress.toString(),
      });

      setStatus('Open positions: ' + JSON.stringify(positions));

      const position = positions.find((position) =>
        position.pairType.endsWith("BTC_USD"),
      );
      if (!position) {
        throw new Error("BTC_USD position not found");
      }

      // close position
      setStatus('Closing position...');
      const closePayload = merkle.payloads.placeMarketOrder({
        pair: "BTC_USD",
        userAddress: account.accountAddress.toString(), // Convert to string
        sizeDelta: position.size,
        collateralDelta: position.collateral,
        isLong: position.isLong,
        isIncrease: false,
      });

      const closeTx = await sendTransaction(closePayload);
      setStatus(`Successfully placed close order (tx hash: ${closeTx.hash})`);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Merkle Trading Demo</h1>
      
      <button 
        onClick={executeTrade}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 mb-4"
      >
        {loading ? 'Executing Trade...' : 'Execute Trade'}
      </button>

      {status && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Status:</h2>
          <pre className="whitespace-pre-wrap">{status}</pre>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          <h2 className="font-bold mb-2">Error:</h2>
          <pre className="whitespace-pre-wrap">{error}</pre>
        </div>
      )}
    </div>
  );
}
