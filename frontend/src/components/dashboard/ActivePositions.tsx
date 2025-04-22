
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Mock positions data
const mockPositions = [
  { 
    id: 1, 
    symbol: 'BTC/USDT', 
    entryPrice: 68251.23, 
    currentPrice: 69120.45,
    amount: 0.05,
    profit: 43.46,
    profitPercentage: 1.27,
    type: 'long'
  },
  { 
    id: 2, 
    symbol: 'ETH/USDT', 
    entryPrice: 3521.10, 
    currentPrice: 3490.25,
    amount: 0.75,
    profit: -23.14,
    profitPercentage: -0.87,
    type: 'long'
  },
  { 
    id: 3, 
    symbol: 'APT/USDT', 
    entryPrice: 8.15, 
    currentPrice: 8.92,
    amount: 125,
    profit: 96.25,
    profitPercentage: 9.45,
    type: 'long'
  }
];

const ActivePositions = () => {
  const [positions] = useState(mockPositions);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Positions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {positions.map((position) => {
            const isProfit = position.profit >= 0;
            const profitColor = isProfit ? 'text-positive' : 'text-negative';
            const ProfitIcon = isProfit ? ArrowUpRight : ArrowDownRight;
            
            return (
              <div key={position.id} className="p-4 border-b last:border-0">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">{position.symbol}</span>
                      <Badge variant={position.type === 'long' ? 'default' : 'destructive'} className="ml-2">
                        {position.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Entry: ${position.entryPrice.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end">
                      <ProfitIcon className={`h-4 w-4 ${profitColor} mr-1`} />
                      <span className={`font-medium ${profitColor}`}>
                        {isProfit ? '+' : ''}${Math.abs(position.profit).toFixed(2)}
                      </span>
                    </div>
                    <div className={`text-sm ${profitColor}`}>
                      {isProfit ? '+' : ''}{position.profitPercentage.toFixed(2)}%
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

export default ActivePositions;
