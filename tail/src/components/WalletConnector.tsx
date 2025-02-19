import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function WalletConnector() {
  const { connect, disconnect, account, wallets } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    if (account) {
      navigate("/account");
    }
  }, [account, navigate]);

  return (
    <div style={{ margin: "20px" }}>
      {!account ? (
        <button
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
          onClick={() => (wallets?.length ? connect(wallets[0].name) : null)}
        >
          Connect Wallet
        </button>
      ) : (
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
      )}
    </div>
  );
}
