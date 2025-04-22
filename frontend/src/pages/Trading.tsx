import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWallet } from '@/context/WalletContext';
import { useToast } from '@/hooks/use-toast';
import TradingChart from '@/components/charts/TradingChart';
import ActivePositions from '@/components/dashboard/ActivePositions';
import WalletConnectModal from '@/components/WalletConnectModal';
import { formatCurrency } from '@/lib/formatters';

// Mock chart data
const mockChartData = [
  { time: '12:00', price: 8.15 },
  { time: '13:00', price: 8.22 },
  { time: '14:00', price: 8.19 },
  { time: '15:00', price: 8.25 },
  { time: '16:00', price: 8.30 },
  { time: '17:00', price: 8.28 },
  { time: '18:00', price: 8.35 },
  { time: '19:00', price: 8.42 },
  { time: '20:00', price: 8.48 },
  { time: '21:00', price: 8.52 },
  { time: '22:00', price: 8.58 },
  { time: '23:00', price: 8.65 },
  { time: '00:00', price: 8.75 },
  { time: '01:00', price: 8.82 },
  { time: '02:00', price: 8.92 },
];

// Trading pairs
const tradingPairs = [
  { value: 'APT/USDT', label: 'APT/USDT' },
  { value: 'BTC/USDT', label: 'BTC/USDT' },
  { value: 'ETH/USDT', label: 'ETH/USDT' },
  { value: 'SOL/USDT', label: 'SOL/USDT' },
  { value: 'AVAX/USDT', label: 'AVAX/USDT' },
];

const Trading = () => {
  const { isConnected } = useWallet();
  const { toast } = useToast();
  const [selectedPair, setSelectedPair] = useState('APT/USDT');
  const [orderType, setOrderType] = useState('market');
  const [orderSide, setOrderSide] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  
  // Current price for the selected pair
  const currentPrice = 8.92; // In a real app, this would come from an API
  
  const handlePairChange = (value: string) => {
    setSelectedPair(value);
  };
  
  const handlePercentageClick = (percentage: number) => {
    setAmount((1000 * percentage / 100).toString()); // Assuming user has 1000 APT for this example
  };
  
  const handlePlaceOrder = () => {
    if (!isConnected) {
      setIsWalletModalOpen(true);
      return;
    }
    
    // In a real app, this would validate the order and submit it to an API
    toast({
      title: "Order Submitted",
      description: `${orderSide.toUpperCase()} ${amount} ${selectedPair.split('/')[0]} at ${orderType === 'market' ? 'market price' : `$${price}`}`,
    });
    
    // Reset form
    setAmount('');
    setPrice('');
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Trading</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Price Chart</CardTitle>
            <Select value={selectedPair} onValueChange={handlePairChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select pair" />
              </SelectTrigger>
              <SelectContent>
                {tradingPairs.map((pair) => (
                  <SelectItem key={pair.value} value={pair.value}>
                    {pair.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <TradingChart data={mockChartData} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Place Order</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="market" onValueChange={setOrderType}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="market">Market</TabsTrigger>
                <TabsTrigger value="limit">Limit</TabsTrigger>
              </TabsList>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={orderSide === 'buy' ? 'default' : 'outline'}
                    className={orderSide === 'buy' ? 'bg-positive hover:bg-positive/90' : ''}
                    onClick={() => setOrderSide('buy')}
                  >
                    Buy
                  </Button>
                  <Button
                    variant={orderSide === 'sell' ? 'destructive' : 'outline'}
                    onClick={() => setOrderSide('sell')}
                  >
                    Sell
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Price</span>
                    <span className="text-sm font-medium">
                      {orderType === 'market' ? `$${currentPrice}` : ''}
                    </span>
                  </div>
                  {orderType === 'limit' && (
                    <Input
                      type="number"
                      placeholder="Enter price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Amount</span>
                    <span className="text-sm font-medium">Available: 1000 APT</span>
                  </div>
                  <Input
                    type="number"
                    placeholder={`Enter ${selectedPair.split('/')[0]} amount`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 75, 100].map((percentage) => (
                    <Button
                      key={percentage}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePercentageClick(percentage)}
                    >
                      {percentage}%
                    </Button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total</span>
                    <span>
                      {amount ? `$${(parseFloat(amount) * currentPrice).toFixed(2)}` : '$0.00'}
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={handlePlaceOrder}
                  variant={orderSide === 'buy' ? 'default' : 'destructive'}
                >
                  {orderSide === 'buy' ? 'Buy' : 'Sell'} {selectedPair.split('/')[0]}
                </Button>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <ActivePositions />
      
      <WalletConnectModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
      />
    </div>
  );
};

export default Trading;
