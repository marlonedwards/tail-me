import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./context/WalletContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Discover from "./pages/Discover";
import Trading from "./pages/Trading";
import Profile from "./pages/Profile";
import TraderProfile from "./pages/TraderProfile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AptosWalletAdapterProvider autoConnect={false}>
      <WalletProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="discover" element={<Discover />} />
                <Route path="trading" element={<Trading />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="trader/:traderId" element={<TraderProfile />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WalletProvider>
    </AptosWalletAdapterProvider>
  </QueryClientProvider>
);

export default App;
