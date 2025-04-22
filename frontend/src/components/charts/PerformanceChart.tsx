
import { useState, useEffect } from 'react';
import { 
  ResponsiveContainer,
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formatters';

interface ChartDataPoint {
  name: string;
  value: number;
}

interface TimeRange {
  key: string;
  label: string;
  data: ChartDataPoint[];
}

interface PerformanceChartProps {
  className?: string;
  title?: string;
}

// Mock data for different time ranges
const MOCK_DATA: Record<string, TimeRange> = {
  '1D': {
    key: '1D',
    label: '1 Day',
    data: [
      { name: '9AM', value: 1250.45 },
      { name: '11AM', value: 1245.70 },
      { name: '1PM', value: 1255.20 },
      { name: '3PM', value: 1260.75 },
      { name: '5PM', value: 1270.35 },
    ],
  },
  '1W': {
    key: '1W',
    label: '1 Week',
    data: [
      { name: 'Mon', value: 1245.50 },
      { name: 'Tue', value: 1255.75 },
      { name: 'Wed', value: 1270.80 },
      { name: 'Thu', value: 1265.25 },
      { name: 'Fri', value: 1285.45 },
      { name: 'Sat', value: 1290.10 },
      { name: 'Sun', value: 1300.35 },
    ],
  },
  '1M': {
    key: '1M',
    label: '1 Month',
    data: [
      { name: 'Week 1', value: 1230.55 },
      { name: 'Week 2', value: 1240.90 },
      { name: 'Week 3', value: 1260.25 },
      { name: 'Week 4', value: 1300.85 },
    ],
  },
  'All': {
    key: 'All',
    label: 'All Time',
    data: [
      { name: 'Jan', value: 1200.40 },
      { name: 'Feb', value: 1230.30 },
      { name: 'Mar', value: 1220.50 },
      { name: 'Apr', value: 1270.75 },
      { name: 'May', value: 1290.60 },
      { name: 'Jun', value: 1250.55 },
      { name: 'Jul', value: 1300.85 },
    ],
  },
};

const PerformanceChart = ({ className, title = "Performance" }: PerformanceChartProps) => {
  const [activeRange, setActiveRange] = useState<string>('1M');
  const [chartData, setChartData] = useState<ChartDataPoint[]>(MOCK_DATA['1M'].data);
  
  useEffect(() => {
    setChartData(MOCK_DATA[activeRange].data);
  }, [activeRange]);
  
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{title}</CardTitle>
        <div className="flex space-x-2">
          {Object.keys(MOCK_DATA).map((period) => (
            <Button 
              key={period} 
              variant={period === activeRange ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setActiveRange(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => formatCurrency(value)}
                dx={-10}
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value as number), 'Value']}
                contentStyle={{ borderRadius: '8px', backgroundColor: 'white', border: '1px solid #e2e8f0' }}
                labelStyle={{ fontSize: 14, fontWeight: 600 }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
