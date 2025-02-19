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
  const performanceColor = isPositive ? 'text-green-600' : 'text-red-600';
  const performanceSign = isPositive ? '+' : '';

  return (
    <Link 
      to={`/model/${id}`}
      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <span className="text-sm text-gray-500">24HR</span>
      </div>

      <div className="mb-4">
        <span className={`text-3xl font-bold ${performanceColor}`}>
          {performanceSign}{performance24h}%
        </span>
      </div>

      <div className="flex items-center text-gray-600">
        <Users size={20} className="mr-2" />
        <span>{followers}</span>
      </div>
    </Link>
  );
};

export default ModelCard;