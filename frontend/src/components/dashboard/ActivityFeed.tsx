
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Mock activity data
const mockActivities = [
  {
    id: 1,
    trader: {
      name: 'Crypto Wizard',
      avatar: ''
    },
    action: 'opened position',
    symbol: 'BTC/USDT',
    type: 'long',
    price: 69120.45,
    amount: 0.025,
    time: '10 minutes ago'
  },
  {
    id: 2,
    trader: {
      name: 'APT Whale',
      avatar: ''
    },
    action: 'closed position',
    symbol: 'APT/USDT',
    type: 'long',
    price: 8.92,
    profit: 12.5,
    amount: 250,
    time: '25 minutes ago'
  },
  {
    id: 3,
    trader: {
      name: 'MOVE Master',
      avatar: ''
    },
    action: 'opened position',
    symbol: 'ETH/USDT',
    type: 'short',
    price: 3490.25,
    amount: 0.5,
    time: '45 minutes ago'
  },
  {
    id: 4,
    trader: {
      name: 'Crypto Wizard',
      avatar: ''
    },
    action: 'closed position',
    symbol: 'SOL/USDT',
    type: 'long',
    price: 152.75,
    profit: -3.2,
    amount: 2,
    time: '1 hour ago'
  }
];

interface ActivityFeedProps {
  className?: string;
}

const ActivityFeed = ({ className }: ActivityFeedProps) => {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {mockActivities.map((activity) => {
            const isOpen = activity.action === 'opened position';
            const hasProfit = 'profit' in activity;
            const isProfit = hasProfit && activity.profit >= 0;
            
            return (
              <div key={activity.id} className="p-4 border-b last:border-0">
                <div className="flex items-start">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {activity.trader.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium">{activity.trader.name}</p>
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.action} {activity.type.toUpperCase()} {activity.symbol} at ${activity.price.toLocaleString()}
                      {hasProfit && (
                        <span className={isProfit ? 'text-positive' : 'text-negative'}>
                          {' '}({isProfit ? '+' : ''}{activity.profit}%)
                        </span>
                      )}
                    </p>
                    
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                        {activity.amount} {activity.symbol.split('/')[0]}
                      </span>
                      {isOpen ? (
                        <span className="text-xs bg-green-50 text-positive px-2 py-0.5 rounded flex items-center">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          Open
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded flex items-center">
                          Closed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
