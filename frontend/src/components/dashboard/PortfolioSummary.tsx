import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

const PortfolioSummary = () => {
  const { walletBalance } = useWallet();

  // Mock portfolio data - in a real app, this would come from an API
  const portfolioData = {
    totalValue: parseFloat(walletBalance) * 16.42, // Mock conversion of APT to USD
    dailyChange: 2.5,
    totalProfit: 1250.32,
    profitPercentage: 11.1,
  };

  const isPositiveChange = portfolioData.dailyChange >= 0;
  const changeColor = isPositiveChange ? "text-positive" : "text-negative";
  const ChangeIcon = isPositiveChange ? ArrowUpRight : ArrowDownRight;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Portfolio Value</p>
            <h3 className="text-2xl font-bold mt-1">
              ${portfolioData.totalValue.toLocaleString()}
            </h3>
            <div className={`flex items-center ${changeColor} mt-1`}>
              <ChangeIcon className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">
                {portfolioData.dailyChange}% today
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Total Profit/Loss</p>
            <h3 className="text-2xl font-bold mt-1 text-positive">
              +${portfolioData.totalProfit.toLocaleString()}
            </h3>
            <p className="text-sm text-positive mt-1">
              (+{portfolioData.profitPercentage}%)
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">APT Balance</p>
            <h3 className="text-2xl font-bold mt-1">{walletBalance}</h3>
            <p className="text-sm text-muted-foreground mt-1">APT</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Active Positions</p>
            <h3 className="text-2xl font-bold mt-1">8</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Across 5 assets
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioSummary;
