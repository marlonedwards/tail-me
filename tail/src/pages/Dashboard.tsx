import { useState } from 'react';
import ModelCard from '../components/ModelCard';
import Trading from '../components/Trading';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { merkleService } from '../services/merkleService';
import { AccountInfo } from '../components/AccountInfo';

interface Model {
  id: string;
  name: string;
  performance24h: number;
  followers: number;
}

const Dashboard = () => {
  const { connected } = useWallet();
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

  const handleGetTestUSDC = async () => {
    try {
      await merkleService.getTestnetUSDC();
      alert('Successfully requested test USDC. Please check your wallet.');
    } catch (error) {
      console.error('Error getting test USDC:', error);
      alert('Error getting test USDC. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Top Models</h1>
      
      {/* Models Section */}
      <div className="flex flex-nowrap overflow-x-auto pb-6 gap-6 scrollbar-hide mb-12">
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

      {/* Trading Section */}
      {connected ? (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Trading Dashboard</h2>
            <button
              onClick={handleGetTestUSDC}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Get Test USDC
            </button>
          </div>
          <AccountInfo/>
          <Trading />
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-white text-lg">Please connect your wallet to start trading</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;