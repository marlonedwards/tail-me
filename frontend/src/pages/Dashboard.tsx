import { useWallet } from "@/context/WalletContext";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import PerformanceChart from "@/components/charts/PerformanceChart";
import PortfolioSummary from "@/components/dashboard/PortfolioSummary";
import ActivePositions from "@/components/dashboard/ActivePositions";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import WalletDashboard from "@/components/dashboard/WalletDashboard";
import { formatCurrency } from "@/lib/formatters";
import WalletConnectButton from "@/components/WalletConnectButton";

const Dashboard = () => {
  const { isConnected } = useWallet();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {isConnected ? (
        <>
          <PortfolioSummary />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PerformanceChart className="md:col-span-2" />

            <WalletDashboard />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActivePositions />
            <ActivityFeed className="md:col-span-2" />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
            <p className="text-gray-500">
              Connect your Aptos wallet to view your dashboard, follow traders,
              and start copy trading.
            </p>
            <WalletConnectButton size="lg" className="mt-4" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
