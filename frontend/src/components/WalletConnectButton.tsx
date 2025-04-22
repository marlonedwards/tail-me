import { useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import WalletConnectModal from "./WalletConnectModal";

interface WalletConnectButtonProps extends ButtonProps {
  showIcon?: boolean;
  buttonText?: string;
}

const WalletConnectButton = ({
  showIcon = true,
  buttonText = "Connect Wallet",
  className,
  ...props
}: WalletConnectButtonProps) => {
  const { isConnected } = useWallet();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  if (isConnected) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setIsWalletModalOpen(true)}
        className={className}
        {...props}
      >
        {showIcon && <Wallet className="mr-2 h-4 w-4" />}
        {buttonText}
      </Button>

      <WalletConnectModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </>
  );
};

export default WalletConnectButton;
