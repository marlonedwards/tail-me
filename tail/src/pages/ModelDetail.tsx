import { useState, useEffect } from 'react';
import ModelCard from '../components/ModelCard';

interface Model {
  id: string;
  name: string;
  performance24h: number;
  followers: number;
}

const Dashboard = () => {
  // This would typically come from an API
  const [models, setModels] = useState<Model[]>([
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
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Top Models</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {models.map((model) => (
          <ModelCard
            key={model.id}
            id={model.id}
            name={model.name}
            performance24h={model.performance24h}
            followers={model.followers}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;