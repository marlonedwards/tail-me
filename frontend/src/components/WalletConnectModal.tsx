
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/context/WalletContext';

interface WalletOption {
  name: string;
  id: 'petra' | 'martian' | 'pontem' | 'rise' | 'other';
  logo: string;
}

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const walletOptions: WalletOption[] = [
  {
    name: 'Petra Wallet',
    id: 'petra',
    logo: '🦊', // In a real app, use actual wallet logos
  },
  {
    name: 'Martian Wallet',
    id: 'martian',
    logo: '👽',
  },
  {
    name: 'Pontem Wallet',
    id: 'pontem',
    logo: '🌉',
  },
  {
    name: 'Rise Wallet',
    id: 'rise',
    logo: '🚀',
  },
];

const WalletConnectModal = ({ isOpen, onClose }: WalletConnectModalProps) => {
  const { connectWallet } = useWallet();

  const handleConnectWallet = async (walletType: 'petra' | 'martian' | 'pontem' | 'rise' | 'other') => {
    await connectWallet(walletType);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {walletOptions.map((wallet) => (
            <Button
              key={wallet.id}
              variant="outline"
              className="flex items-center justify-start h-14 px-4"
              onClick={() => handleConnectWallet(wallet.id)}
            >
              <span className="text-2xl mr-4">{wallet.logo}</span>
              {wallet.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectModal;
