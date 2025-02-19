import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletConnector } from "./components/WalletConnector";
import { AccountInfo } from "./components/AccountInfo";
import "./App.css";

const wallets = [new PetraWallet(), new MartianWallet()];

function App() {
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div
                className="App"
                style={{ padding: "20px", textAlign: "center" }}
              >
                <h1 style={{ color: "#333" }}>Aptos Wallet Connection</h1>
                <WalletConnector />
              </div>
            }
          />
          <Route path="/account" element={<AccountInfo />} />
        </Routes>
      </BrowserRouter>
    </AptosWalletAdapterProvider>
  );
}

export default App;
