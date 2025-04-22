
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useWallet } from '@/context/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Edit, Copy, ExternalLink } from 'lucide-react';
import { following_cache_key, Trader } from '@/utils/consts';

// Mock data for followed traders
const followedTraders = [
  {
    id: '1',
    name: 'Crypto Wizard',
    avatar: '',
    stats: {
      roi: 32.5,
      followers: 1420
    }
  },
  {
    id: '2',
    name: 'APT Whale',
    avatar: '',
    stats: {
      roi: 28.7,
      followers: 950
    }
  },
  {
    id: '4',
    name: 'AI Trader Bot',
    avatar: '',
    stats: {
      roi: 41.5,
      followers: 2150
    }
  }
];

const Profile = () => {
  const { isConnected, walletAddress, walletBalance, disconnectWallet } = useWallet();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [following, setFollowing] = useState<{ [id: string]: Trader }>({} as { [id: string]: Trader });


  const [profile, setProfile] = useState({
    username: 'AptosTradingFan',
    bio: 'Passionate about blockchain technology and copy trading on Aptos.',
    avatar: ''
  });

  useEffect(()=>{
    if (isConnected) {
      const user = localStorage.getItem(following_cache_key);
      if(!user){
        localStorage.setItem(following_cache_key, JSON.stringify({
          id: walletAddress,
          address: walletAddress,
          following: []
        }));
        
      }else{
        setFollowing(JSON.parse(user).following);
      }
    }
  },[])


  
  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast({
        title: 'Address Copied',
        description: 'Wallet address copied to clipboard.',
      });
    }
  };
  
  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been updated successfully.',
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleUnfollow = (traderId: string, traderName: string) => {
    toast({
      title: 'Trader Unfollowed',
      description: `You have unfollowed ${traderName}.`,
    });
  };
  
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
          <p className="text-gray-500">
            Connect your Aptos wallet to view your profile and manage your copy trading settings.
          </p>
          <Button size="lg" className="mt-4">Connect Wallet</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your personal information and public profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-primary text-white text-xl">
                        {profile.username.substring(0, 2)}
                      </AvatarFallback>
                      {profile.avatar && <AvatarImage src={profile.avatar} />}
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={profile.username}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={profile.bio}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={handleSaveProfile}>
                      <Check className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-primary text-white text-xl">
                          {profile.username.substring(0, 2)}
                        </AvatarFallback>
                        {profile.avatar && <AvatarImage src={profile.avatar} />}
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-bold">{profile.username}</h3>
                        <p className="text-sm text-muted-foreground">Member since April 2023</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Bio</h4>
                    <p>{profile.bio}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Copy Trading</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="following">
                <TabsList className="mb-4">
                  <TabsTrigger value="following">Following ({followedTraders.length})</TabsTrigger>
                  <TabsTrigger value="copiers">Copiers (0)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="following">
                  {followedTraders.length > 0 ? (
                    <div className="space-y-4">
                      {followedTraders.map((trader) => (
                        <div key={trader.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {trader.name.substring(0, 2)}
                              </AvatarFallback>
                              {trader.avatar && <AvatarImage src={trader.avatar} />}
                            </Avatar>
                            <div>
                              <Link to={`/trader/${trader.id}`} className="font-medium hover:underline">
                                {trader.name}
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                ROI +{trader.stats.roi}% · {trader.stats.followers} followers
                              </p>
                            </div>
                          </div>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/trader/${trader.id}`}>Settings</Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUnfollow(trader.id, trader.name)}
                            >
                              Unfollow
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="mt-4">
                        <Button variant="outline" asChild>
                          <Link to="/discover">Discover More Traders</Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium mb-2">You're not following anyone yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Discover and follow traders to start copy trading
                      </p>
                      <Button asChild>
                        <Link to="/discover">Browse Traders</Link>
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="copiers">
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium mb-2">No one is copying your trades yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Once you start making successful trades, others can follow you
                    </p>
                    <Button asChild>
                      <Link to="/trading">Start Trading</Link>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Address</h4>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">
                    {walletAddress?.substring(0, 8)}...{walletAddress?.substring(walletAddress.length - 4)}
                  </span>
                  <div className="space-x-1">
                    <Button variant="ghost" size="icon" onClick={handleCopyAddress}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`https://explorer.aptoslabs.com/account/${walletAddress}`} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Balance</h4>
                <p className="font-bold">{walletBalance} APT</p>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full text-red-500 hover:text-red-600"
                onClick={disconnectWallet}
              >
                Disconnect Wallet
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Copy Trading Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Traders Following</span>
                <span className="font-medium">{followedTraders.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Copy Positions</span>
                <span className="font-medium">4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Copy Profit</span>
                <span className="font-medium text-positive">+$325.42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">ROI (All Time)</span>
                <span className="font-medium text-positive">+12.8%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
