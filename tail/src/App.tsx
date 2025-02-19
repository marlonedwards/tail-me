import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletConnector } from "./components/WalletConnector";
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ModelDetail from './pages/ModelDetail';
import { AccountInfo } from "./components/AccountInfo";
import "./App.css";
import MerkleTradePage from "./pages/merkle-trade";
import OldTrade from "./components/Trading";

const wallets = [new PetraWallet(), new MartianWallet()];

function App() {
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-900">
          <Navbar />
          <main className="container mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/model/:id" element={<ModelDetail />} />
              <Route path="/account" element={<AccountInfo />} />
              <Route path="/test-merkle" element={<MerkleTradePage />} />
              <Route path="/old-trade" element={<OldTrade />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AptosWalletAdapterProvider>
  );
}

export default App;