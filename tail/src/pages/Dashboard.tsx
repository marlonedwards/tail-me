import { useState } from 'react';
import ModelCard from '../components/ModelCard';

interface Model {
  id: string;
  name: string;
  performance24h: number;
  followers: number;
}

const Dashboard = () => {
  const [models] = useState<Model[]>([
    {
      id: '1',
      name: 'BTC Sentiment AI',
      performance24h: 12.5,
      followers: 1234,
    },
    {
      id: '2',
      name: 'Crypto Whale Tracker',
      performance24h: -2.3,
      followers: 856,
    },
    {
      id: '3',
      name: 'APT Momentum',
      performance24h: 5.7,
      followers: 2145,
    },
    {
      id: '4',
      name: 'DeFi Pulse',
      performance24h: 8.9,
      followers: 1567,
    },
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Top Models</h1>
      <div className="flex flex-nowrap overflow-x-auto pb-6 gap-6 scrollbar-hide">
        {models.map((model) => (
          <div key={model.id} className="flex-none w-80">
            <ModelCard
              id={model.id}
              name={model.name}
              performance24h={model.performance24h}
              followers={model.followers}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;