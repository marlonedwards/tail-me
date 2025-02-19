import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Types, AptosClient } from "aptos";

const USDC_COIN_TYPE = "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832::test_usdc::TestUSDC";

export function AccountInfo() {
  const { account, disconnect } = useWallet();
  const navigate = useNavigate();
  const [aptBalance, setAptBalance] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);

  const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/");

  useEffect(() => {
    if (!account) {
      navigate("/");
    }
  }, [account, navigate]);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!account) return;
      try {
        const resources = await client.getAccountResources(account.address);
        
        // Fetch APT balance
        const aptosCoin = resources.find(
          (r) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
        );
        if (aptosCoin) {
          const balance = (aptosCoin.data as any).coin.value;
          setAptBalance((Number(balance) / 100000000).toFixed(4));
        }

        // Fetch USDC balance
        const usdcCoin = resources.find(
          (r) => r.type === `0x1::coin::CoinStore<${USDC_COIN_TYPE}>`
        );
        if (usdcCoin) {
          const balance = (usdcCoin.data as any).coin.value;
          setUsdcBalance((Number(balance) / 1_000_000).toFixed(2)); // USDC has 6 decimals
        } else {
          setUsdcBalance("0.00"); // Account hasn't registered USDC yet
        }
      } catch (error) {
        console.error("Error fetching balances:", error);
        setAptBalance(null);
        setUsdcBalance(null);
      }
    };

    fetchBalances();
    // Set up an interval to refresh balances
    const interval = setInterval(fetchBalances, 5000);
    return () => clearInterval(interval);
  }, [account, client]);

  if (!account) return null;

  const address = "0xed20f08a610c582115eefc3cf6c253792b299a21fdc0c5163c2c0122ce5dd8ad";
const testClient = new AptosClient("https://fullnode.testnet.aptoslabs.com/");

testClient.getAccountResources(address).then(resources => {
  // Look for all fungible assets
  const fungibleStores = resources.filter(r => 
    r.type.includes("fungible_asset")
  );
  console.log("All Fungible Stores:", fungibleStores);
});



  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Account Information</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            <strong>Address:</strong> 
            <span className="ml-2 text-gray-800 break-all">{account.address}</span>
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Public Key:</strong> 
            <span className="ml-2 text-gray-800 break-all">{account.publicKey}</span>
          </p>
        </div>
        
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-4">Balances</h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              <strong>APT:</strong> 
              <span className="ml-2 text-gray-800">
                {aptBalance ? `${aptBalance} APT` : "Loading..."}
              </span>
            </p>
            <p className="text-gray-600">
              <strong>USDC:</strong> 
              <span className="ml-2 text-gray-800">
                {usdcBalance ? `$${usdcBalance}` : "Loading..."}
              </span>
            </p>
          </div>
        </div>
      </div>
      
      <button
        onClick={disconnect}
        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
      >
        Disconnect
      </button>
    </div>
  );
}