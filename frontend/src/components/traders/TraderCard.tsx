
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, LineChart, BarChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TraderStats {
  roi: number;
  winRate: number;
  followers: number;
  trades: number;
}

interface Trader {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  stats: TraderStats;
}

interface TraderCardProps {
  trader: Trader;
}

const TraderCard = ({ trader }: TraderCardProps) => {
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  
  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false);
      toast({
        title: "Unfollowed",
        description: `You've unfollowed ${trader.name}`,
      });
    } else {
      setIsFollowing(true);
      toast({
        title: "Now Following",
        description: `You're now following ${trader.name}`,
      });
    }
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Link to={`/trader/${trader.id}`} className="flex items-center">
            <Avatar className="h-12 w-12 mr-4">
              <AvatarFallback className="bg-primary text-white">
                {trader.name.substring(0, 2)}
              </AvatarFallback>
              {trader.avatar && <AvatarImage src={trader.avatar} />}
            </Avatar>
            <div>
              <h3 className="font-bold text-lg">{trader.name}</h3>
              <p className="text-sm text-muted-foreground">
                {trader.stats.followers.toLocaleString()} followers
              </p>
            </div>
          </Link>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {trader.bio}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp size={14} />
              <span>ROI</span>
            </div>
            <p className="font-bold text-positive">+{trader.stats.roi}%</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <BarChart size={14} />
              <span>Win Rate</span>
            </div>
            <p className="font-bold">{trader.stats.winRate}%</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <LineChart size={14} className="mr-1" />
            <span>{trader.stats.trades} trades</span>
          </div>
          <div className="flex items-center">
            <Users size={14} className="mr-1" />
            <span>{trader.stats.followers} followers</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 pb-6 pt-0 flex flex-col">
        <Button
          onClick={handleFollowToggle}
          variant={isFollowing ? "outline" : "default"}
          className="w-full"
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
        
        <Link to={`/trader/${trader.id}`} className="w-full mt-2">
          <Button variant="ghost" className="w-full">
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TraderCard;
