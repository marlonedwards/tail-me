
import { useState } from 'react';
import { 
  ResponsiveContainer,
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid
} from 'recharts';
import { formatCurrency } from '@/lib/formatters';

interface TradingChartProps {
  data: Array<{
    time: string;
    price: number;
  }>;
  height?: number;
}

const TradingChart = ({ data, height = 400 }: TradingChartProps) => {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            domain={['dataMin - 0.1', 'dataMax + 0.1']} 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatCurrency(value)}
            dx={-10}
          />
          <Tooltip 
            formatter={(value) => [formatCurrency(value as number), 'Price']}
            contentStyle={{ borderRadius: '8px', backgroundColor: 'white', border: '1px solid #e2e8f0' }}
            labelStyle={{ fontSize: 14, fontWeight: 600 }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#3b82f6" 
            fillOpacity={1}
            fill="url(#colorPrice)" 
            strokeWidth={2} 
            dot={false}
            animationDuration={500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TradingChart;
