import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

interface ModelCardProps {
  id: string;
  name: string;
  performance24h: number;
  followers: number;
}

const ModelCard = ({ id, name, performance24h, followers }: ModelCardProps) => {
  const isPositive = performance24h >= 0;
  const performanceColor = isPositive ? 'text-green-500' : 'text-red-500';
  const performanceSign = isPositive ? '+' : '';

  return (
    <Link 
      to={`/model/${id}`}
      className="block bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-all p-6 h-full"
    >
      <div className="flex justify-between items-start mb-8">
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        <span className="text-sm text-gray-400 bg-gray-700/50 px-2 py-1 rounded">24HR</span>
      </div>

      <div className="mb-8 text-center">
        <span className={`text-4xl font-bold ${performanceColor}`}>
          {performanceSign}{performance24h}%
        </span>
      </div>

      <div className="flex items-center justify-center text-gray-400 bg-gray-700/30 rounded-lg py-2">
        <Users size={20} className="mr-2" />
        <span>{followers.toLocaleString()}</span>
      </div>
    </Link>
  );
};

export default ModelCard;