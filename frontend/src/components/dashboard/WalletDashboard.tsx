import { Copy, ExternalLink, Wallet } from "lucide-react";
import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const WalletDashboard = () => {
  const { walletAddress, walletBalance, walletType, disconnectWallet } =
    useWallet();
  const { toast } = useToast();
  const [showCopied, setShowCopied] = useState(false);

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setShowCopied(true);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Wallet Details</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">
            Wallet Type
          </h4>
          <p className="font-bold capitalize">{walletType || "Unknown"}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">
            Address
          </h4>
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm">
              {walletAddress
                ? `${walletAddress.substring(0, 8)}...${walletAddress.substring(
                    walletAddress.length - 4
                  )}`
                : "Not connected"}
            </span>
            <div className="space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyAddress}
                disabled={!walletAddress}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                disabled={!walletAddress}
              >
                <a
                  href={
                    walletAddress
                      ? `https://explorer.aptoslabs.com/account/${walletAddress}`
                      : "#"
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1">
            Balance
          </h4>
          <p className="font-bold">{walletBalance} APT</p>
        </div>

        <Button
          variant="outline"
          className="w-full text-red-500 hover:text-red-600 mt-2"
          onClick={disconnectWallet}
        >
          Disconnect Wallet
        </Button>
      </CardContent>
    </Card>
  );
};

export default WalletDashboard;
