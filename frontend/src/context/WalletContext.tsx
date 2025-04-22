import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useToast } from "@/hooks/use-toast";
import {
  useWallet as useAptosWallet,
  WalletReadyState,
} from "@aptos-labs/wallet-adapter-react";
import { AptosClient } from "aptos";

type WalletType = "petra" | "martian" | "pontem" | "rise" | "other";

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  walletBalance: string;
  walletType: WalletType | null;
  connectWallet: (type: WalletType) => Promise<void>;
  disconnectWallet: () => void;
  signTransaction: (transaction: any) => Promise<any>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

// Aptos client for fetching balance
const aptosClient = new AptosClient(
  "https://fullnode.testnet.aptoslabs.com/v1"
);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const { toast } = useToast();

  // Use the Aptos wallet adapter
  const {
    connect,
    disconnect,
    account,
    connected,
    wallets,
    signAndSubmitTransaction,
    wallet: currentWallet,
  } = useAptosWallet();

  const [walletBalance, setWalletBalance] = useState("0");

  // Update balance when account changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (account?.address) {
        try {
          // Convert account address to string format that Aptos client can use
          const hexAddress = account.address.toString();
          const resources = await aptosClient.getAccountResources(hexAddress);

          const aptosCoinResource = resources.find(
            (r) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"
          );

          if (aptosCoinResource) {
            const balance = (aptosCoinResource.data as any).coin.value;
            // Convert from octas to APT (1 APT = 10^8 octas)
            const formattedBalance = (parseInt(balance) / 100000000).toFixed(2);
            setWalletBalance(formattedBalance);
          }
        } catch (error) {
          console.error("Failed to fetch balance:", error);
          setWalletBalance("0");
        }
      } else {
        setWalletBalance("0");
      }
    };

    fetchBalance();
  }, [account?.address]);

  const connectWallet = useCallback(
    async (type: WalletType) => {
      try {
        setWalletType(type);

        // Find the wallet by name that matches the type
        const walletNameMap: Record<WalletType, string> = {
          petra: "Petra",
          martian: "Martian",
          pontem: "Pontem",
          rise: "Rise",
          other: "Other",
        };

        const walletName = walletNameMap[type];

        // Debug output to console for available wallets
        console.log("Available wallets:", wallets.map(w => ({ 
          name: w.name, 
          readyState: w.readyState,
          readyStateText: WalletReadyState[w.readyState]
        })));

        // Check if any wallets are available at all
        if (wallets.length === 0) {
          throw new Error("No wallets detected. Please make sure you have wallet extensions installed.");
        }

        // Try to find the wallet
        let selectedWallet = wallets.find(
          (wallet) =>
            wallet.name === walletName &&
            wallet.readyState === WalletReadyState.Installed
        );

        // If not found by exact name, try partial matching (some wallets may have different naming)
        if (!selectedWallet) {
          selectedWallet = wallets.find(
            (wallet) =>
              wallet.name.toLowerCase().includes(walletName.toLowerCase()) &&
              wallet.readyState === WalletReadyState.Installed
          );
        }

        // If still not found, check if any version of this wallet is available but not ready
        if (!selectedWallet) {
          const notReadyWallet = wallets.find(
            (wallet) => wallet.name.toLowerCase().includes(walletName.toLowerCase())
          );

          if (notReadyWallet) {
            // The wallet exists but isn't ready
            const readyStateText = WalletReadyState[notReadyWallet.readyState];
            throw new Error(
              `${type} wallet was found but is not ready (state: ${readyStateText}). Please unlock or reload your wallet.`
            );
          } else {
            throw new Error(
              `${type} wallet not detected. Please install the wallet extension and refresh the page.`
            );
          }
        }

        // Try connecting with the adapter name now
        console.log(`Attempting to connect to ${selectedWallet.name}...`);
        await connect(selectedWallet.name);

        toast({
          title: "Wallet Connected",
          description: `Successfully connected to ${selectedWallet.name} wallet`,
        });
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        setWalletType(null); // Reset wallet type on failure
        toast({
          title: "Connection Failed",
          description:
            error instanceof Error
              ? error.message
              : "Failed to connect wallet. Please try again.",
          variant: "destructive",
        });
      }
    },
    [connect, wallets, toast]
  );

  const disconnectWallet = useCallback(() => {
    disconnect();
    setWalletType(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  }, [disconnect, toast]);

  const signTransaction = useCallback(
    async (transaction: any) => {
      if (!connected) {
        throw new Error("Wallet not connected");
      }

      try {
        // Use transaction as is - this matches the adapter's expected input
        return await signAndSubmitTransaction(transaction);
      } catch (error) {
        console.error("Failed to sign transaction:", error);
        throw error;
      }
    },
    [connected, signAndSubmitTransaction]
  );

  const value = useMemo(
    () => ({
      isConnected: connected,
      walletAddress: account?.address ? account.address.toString() : null,
      walletBalance,
      walletType,
      connectWallet,
      disconnectWallet,
      signTransaction,
    }),
    [
      connected,
      account?.address,
      walletBalance,
      walletType,
      connectWallet,
      disconnectWallet,
      signTransaction,
    ]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
