
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  TrendingUp,
  BarChart,
  LineChart,
  ArrowRight,
  Users,
  Clock,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import TraderCard from '@/components/traders/TraderCard';

// Mock traders data - this would come from an API in a real app
const mockTraders = {
  '1': {
    id: '1',
    name: 'Crypto Wizard',
    avatar: '',
    bio: 'Professional crypto trader with 7 years experience. Specializing in BTC and ETH trades.',
    stats: {
      roi: 32.5,
      winRate: 68,
      followers: 1420,
      trades: 287,
      avgTradeDuration: '3.2 days',
      profitFactor: 2.4,
      dailyVolume: '$125,000'
    }
  },
  '2': {
    id: '2',
    name: 'APT Whale',
    avatar: '',
    bio: 'Aptos blockchain specialist. Focus on APT and ecosystem tokens.',
    stats: {
      roi: 28.7,
      winRate: 65,
      followers: 950,
      trades: 165,
      avgTradeDuration: '5.5 days',
      profitFactor: 1.9,
      dailyVolume: '$85,000'
    }
  }
};

// Mock trading history
const mockTradingHistory = [
  { 
    id: 1, 
    pair: 'BTC/USDT',
    type: 'long',
    entryPrice: 68251.25,
    exitPrice: 69120.45,
    amount: 0.05,
    profit: 4.32,
    date: '2023-04-08',
    status: 'closed'
  },
  { 
    id: 2, 
    pair: 'ETH/USDT',
    type: 'long',
    entryPrice: 3521.10,
    exitPrice: 3490.25,
    amount: 0.75,
    profit: -0.87,
    date: '2023-04-07',
    status: 'closed'
  },
  { 
    id: 3, 
    pair: 'APT/USDT',
    type: 'long',
    entryPrice: 8.15,
    exitPrice: null,
    amount: 125,
    profit: 9.45,
    date: '2023-04-06',
    status: 'open'
  },
  { 
    id: 4, 
    pair: 'SOL/USDT',
    type: 'short',
    entryPrice: 152.75,
    exitPrice: 148.20,
    amount: 10,
    profit: 2.98,
    date: '2023-04-05',
    status: 'closed'
  },
  { 
    id: 5, 
    pair: 'BTC/USDT',
    type: 'long',
    entryPrice: 66450.30,
    exitPrice: 66900.10,
    amount: 0.03,
    profit: 0.68,
    date: '2023-04-04',
    status: 'closed'
  }
];

// Similar traders to suggest for following
const similarTraders = [
  {
    id: '3',
    name: 'MOVE Master',
    avatar: '',
    bio: 'Technical analysis expert focusing on MOVE programming. Building strategies with AI.',
    stats: {
      roi: 24.2,
      winRate: 72,
      followers: 740,
      trades: 124
    }
  },
  {
    id: '4',
    name: 'AI Trader Bot',
    avatar: '',
    bio: 'AI-powered trading algorithm optimized for Aptos ecosystem. Consistent performance.',
    stats: {
      roi: 41.5,
      winRate: 75,
      followers: 2150,
      trades: 452
    }
  }
];

const TraderProfile = () => {
  const { traderId } = useParams<{ traderId: string }>();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [allocationPercentage, setAllocationPercentage] = useState([10]);
  const [followSettings, setFollowSettings] = useState({
    spot: true,
    margin: false,
    futures: false
  });
  
  const trader = mockTraders[traderId as keyof typeof mockTraders];
  
  if (!trader) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Trader Not Found</h2>
          <p className="text-muted-foreground mt-2">The trader you're looking for doesn't exist.</p>
          <Button variant="default" className="mt-4" asChild>
            <a href="/discover">Browse Traders</a>
          </Button>
        </div>
      </div>
    );
  }
  
  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false);
      toast({
        title: "Unfollowed",
        description: `You've unfollowed ${trader.name}`,
      });
    } else {
      setIsFollowing(true);
      toast({
        title: "Now Following",
        description: `You're now following ${trader.name} with ${allocationPercentage}% allocation`,
      });
    }
  };
  
  const handleAllocationChange = (value: number[]) => {
    setAllocationPercentage(value);
  };
  
  const handleSettingToggle = (key: keyof typeof followSettings) => {
    setFollowSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center">
                  <Avatar className="h-16 w-16 mr-4">
                    <AvatarFallback className="bg-primary text-white text-xl">
                      {trader.name.substring(0, 2)}
                    </AvatarFallback>
                    {trader.avatar && <AvatarImage src={trader.avatar} />}
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold">{trader.name}</h1>
                    <div className="flex items-center mt-1">
                      <Users size={16} className="text-muted-foreground mr-1" />
                      <span className="text-muted-foreground">{trader.stats.followers.toLocaleString()} followers</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleFollowToggle}
                  variant={isFollowing ? "outline" : "default"}
                  className="w-full md:w-auto"
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              </div>
              
              <div className="mt-6">
                <p className="text-muted-foreground">{trader.bio}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <TrendingUp size={16} />
                    <span>ROI</span>
                  </div>
                  <p className="font-bold text-positive text-xl">+{trader.stats.roi}%</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <BarChart size={16} />
                    <span>Win Rate</span>
                  </div>
                  <p className="font-bold text-xl">{trader.stats.winRate}%</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <LineChart size={16} />
                    <span>Trades</span>
                  </div>
                  <p className="font-bold text-xl">{trader.stats.trades}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock size={16} />
                    <span>Avg Duration</span>
                  </div>
                  <p className="font-bold text-xl">{trader.stats.avgTradeDuration}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="history">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="history">Trading History</TabsTrigger>
              <TabsTrigger value="stats">Performance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Trading History</CardTitle>
                  <CardDescription>
                    Recent trades performed by {trader.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Pair</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Entry</TableHead>
                          <TableHead>Exit</TableHead>
                          <TableHead>Profit</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockTradingHistory.map((trade) => (
                          <TableRow key={trade.id}>
                            <TableCell className="font-medium">{trade.pair}</TableCell>
                            <TableCell>
                              <Badge variant={trade.type === 'long' ? 'outline' : 'destructive'}>
                                {trade.type.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>${trade.entryPrice.toLocaleString()}</TableCell>
                            <TableCell>
                              {trade.exitPrice ? `$${trade.exitPrice.toLocaleString()}` : '-'}
                            </TableCell>
                            <TableCell className={trade.profit >= 0 ? 'text-positive' : 'text-negative'}>
                              {trade.profit >= 0 ? '+' : ''}{trade.profit}%
                            </TableCell>
                            <TableCell>{trade.date}</TableCell>
                            <TableCell>
                              <Badge variant={trade.status === 'open' ? 'default' : 'secondary'}>
                                {trade.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex justify-center mt-4">
                    <Button variant="outline">Load More</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Return on Investment (ROI)
                        </h4>
                        <p className="text-xl font-bold text-positive">+{trader.stats.roi}%</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Win Rate
                        </h4>
                        <p className="text-xl font-bold">{trader.stats.winRate}%</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Total Trades
                        </h4>
                        <p className="text-xl font-bold">{trader.stats.trades}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Average Trade Duration
                        </h4>
                        <p className="text-xl font-bold">{trader.stats.avgTradeDuration}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Profit Factor
                        </h4>
                        <p className="text-xl font-bold">{trader.stats.profitFactor}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Daily Volume
                        </h4>
                        <p className="text-xl font-bold">{trader.stats.dailyVolume}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Copy Trading Settings</CardTitle>
              <CardDescription>
                Configure how you want to follow this trader
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="allocation">Allocation</Label>
                  <span className="text-sm font-medium">{allocationPercentage}%</span>
                </div>
                <Slider 
                  id="allocation"
                  min={1} 
                  max={100} 
                  step={1} 
                  value={allocationPercentage}
                  onValueChange={handleAllocationChange}
                />
                <p className="text-sm text-muted-foreground">
                  Percentage of your portfolio to allocate to copy this trader's positions
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Trading Types</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="spot">Spot Trading</Label>
                    <p className="text-sm text-muted-foreground">Regular buy/sell transactions</p>
                  </div>
                  <Switch 
                    id="spot" 
                    checked={followSettings.spot}
                    onCheckedChange={() => handleSettingToggle('spot')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="margin">Margin Trading</Label>
                    <p className="text-sm text-muted-foreground">Trade with borrowed funds</p>
                  </div>
                  <Switch 
                    id="margin" 
                    checked={followSettings.margin}
                    onCheckedChange={() => handleSettingToggle('margin')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="futures">Futures Trading</Label>
                    <p className="text-sm text-muted-foreground">Derivative contracts</p>
                  </div>
                  <Switch 
                    id="futures" 
                    checked={followSettings.futures}
                    onCheckedChange={() => handleSettingToggle('futures')}
                  />
                </div>
              </div>
              
              <Button onClick={handleFollowToggle} className="w-full">
                {isFollowing ? "Update Settings" : "Start Copy Trading"}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Similar Traders</CardTitle>
              <CardDescription>
                You might also be interested in these traders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {similarTraders.map((similarTrader) => (
                <div key={similarTrader.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {similarTrader.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{similarTrader.name}</p>
                      <p className="text-sm text-muted-foreground">ROI +{similarTrader.stats.roi}%</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={`/trader/${similarTrader.id}`}>
                      <ArrowRight size={16} />
                    </a>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TraderProfile;
