import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Types, AptosClient } from "aptos";

export function AccountInfo() {
  const { account, disconnect } = useWallet();
  const navigate = useNavigate();
  const [balance, setBalance] = useState<string | null>(null);

  const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/");

  useEffect(() => {
    if (!account) {
      navigate("/");
    }
  }, [account, navigate]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!account) return;
      try {
        const resources = await client.getAccountResources(account.address);
        const aptosCoin = resources.find(
          (r) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
        );
        if (aptosCoin) {
          const balance = (aptosCoin.data as any).coin.value;
          // Convert from octas to APT (1 APT = 100000000 octas)
          setBalance((Number(balance) / 100000000).toFixed(4));
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance(null);
      }
    };

    fetchBalance();
  }, [account, client]);

  if (!account) return null;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1 style={{ color: "#333" }}>Account Information</h1>
      <div
        style={{
          margin: "20px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <p>
          <strong>Address:</strong> {account.address}
        </p>
        <p>
          <strong>Public Key:</strong> {account.publicKey}
        </p>
        <p>
          <strong>Balance:</strong> {balance ? `${balance} APT` : "Loading..."}
        </p>
      </div>
      <button
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
        onClick={disconnect}
      >
        Disconnect
      </button>
    </div>
  );
}
