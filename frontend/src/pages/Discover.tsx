
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';
import TraderCard from '@/components/traders/TraderCard';

// Mock traders data
const mockTraders = [
  {
    id: '1',
    name: 'Crypto Wizard',
    avatar: '',
    bio: 'Professional crypto trader with 7 years experience. Specializing in BTC and ETH trades.',
    stats: {
      roi: 32.5,
      winRate: 68,
      followers: 1420,
      trades: 287
    }
  },
  {
    id: '2',
    name: 'APT Whale',
    avatar: '',
    bio: 'Aptos blockchain specialist. Focus on APT and ecosystem tokens.',
    stats: {
      roi: 28.7,
      winRate: 65,
      followers: 950,
      trades: 165
    }
  },
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
  },
  {
    id: '5',
    name: 'DeFi Explorer',
    avatar: '',
    bio: 'DeFi expert specializing in yield strategies and liquid staking on Aptos.',
    stats: {
      roi: 18.3,
      winRate: 63,
      followers: 580,
      trades: 98
    }
  },
  {
    id: '6',
    name: 'Momentum Hunter',
    avatar: '',
    bio: 'Finding momentum plays before they happen. Specializing in short-term trades.',
    stats: {
      roi: 36.8,
      winRate: 61,
      followers: 875,
      trades: 320
    }
  }
];

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('roi');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };
  
  // Filter and sort traders
  const filteredTraders = mockTraders
    .filter(trader => trader.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch(sortBy) {
        case 'roi':
          return b.stats.roi - a.stats.roi;
        case 'winRate':
          return b.stats.winRate - a.stats.winRate;
        case 'followers':
          return b.stats.followers - a.stats.followers;
        case 'trades':
          return b.stats.trades - a.stats.trades;
        default:
          return 0;
      }
    });
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Discover Traders</h1>
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search traders..." 
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm">Sort by:</span>
          </div>
          
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="roi">ROI</SelectItem>
              <SelectItem value="winRate">Win Rate</SelectItem>
              <SelectItem value="followers">Followers</SelectItem>
              <SelectItem value="trades">Trade Count</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTraders.map((trader) => (
          <TraderCard key={trader.id} trader={trader} />
        ))}
      </div>
    </div>
  );
};

export default Discover;
