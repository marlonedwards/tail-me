
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { BellRing, Bell, DollarSign, Clock, AlertCircle, User, Shield } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { useState } from 'react';

const Settings = () => {
  const { isConnected } = useWallet();
  const { toast } = useToast();
  
  const [notificationSettings, setNotificationSettings] = useState({
    tradeOpened: true,
    tradeClosed: true,
    priceAlerts: false,
    newFollowers: true,
    securityAlerts: true,
    newsletter: false
  });
  
  const [tradingSettings, setTradingSettings] = useState({
    maxRiskPerTrade: 5,
    maxConcurrentTrades: 10,
    autoCopyDelay: '5',
    defaultAllocation: 10
  });
  
  const handleNotificationToggle = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleRiskChange = (value: number[]) => {
    setTradingSettings(prev => ({
      ...prev,
      maxRiskPerTrade: value[0]
    }));
  };
  
  const handleAllocationChange = (value: number[]) => {
    setTradingSettings(prev => ({
      ...prev,
      defaultAllocation: value[0]
    }));
  };
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };
  
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
          <p className="text-gray-500">
            Connect your Aptos wallet to view and update your settings.
          </p>
          <Button size="lg" className="mt-4">Connect Wallet</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BellRing className="h-5 w-5 mr-2" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Configure how and when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="trade-opened">Trade Opened</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when a trader you follow opens a position
                </p>
              </div>
              <Switch 
                id="trade-opened" 
                checked={notificationSettings.tradeOpened}
                onCheckedChange={() => handleNotificationToggle('tradeOpened')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="trade-closed">Trade Closed</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when a trader you follow closes a position
                </p>
              </div>
              <Switch 
                id="trade-closed" 
                checked={notificationSettings.tradeClosed}
                onCheckedChange={() => handleNotificationToggle('tradeClosed')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="price-alerts">Price Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for price changes on your watchlist
                </p>
              </div>
              <Switch 
                id="price-alerts" 
                checked={notificationSettings.priceAlerts}
                onCheckedChange={() => handleNotificationToggle('priceAlerts')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="new-followers">New Followers</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when someone follows your account
                </p>
              </div>
              <Switch 
                id="new-followers" 
                checked={notificationSettings.newFollowers}
                onCheckedChange={() => handleNotificationToggle('newFollowers')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="security-alerts">Security Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for important security events
                </p>
              </div>
              <Switch 
                id="security-alerts" 
                checked={notificationSettings.securityAlerts}
                onCheckedChange={() => handleNotificationToggle('securityAlerts')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="newsletter">Newsletter & Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Receive platform updates and newsletter
                </p>
              </div>
              <Switch 
                id="newsletter" 
                checked={notificationSettings.newsletter}
                onCheckedChange={() => handleNotificationToggle('newsletter')}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Trading Settings
            </CardTitle>
            <CardDescription>
              Configure default settings for copy trading
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="max-risk">Maximum Risk Per Trade</Label>
                <span className="text-sm font-medium">{tradingSettings.maxRiskPerTrade}%</span>
              </div>
              <Slider 
                id="max-risk"
                min={1} 
                max={20} 
                step={1} 
                value={[tradingSettings.maxRiskPerTrade]}
                onValueChange={handleRiskChange}
              />
              <p className="text-sm text-muted-foreground">
                Maximum percentage of your portfolio to risk on a single trade
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max-trades">Maximum Concurrent Trades</Label>
              <Input
                id="max-trades"
                type="number"
                value={tradingSettings.maxConcurrentTrades}
                onChange={(e) => setTradingSettings(prev => ({
                  ...prev,
                  maxConcurrentTrades: parseInt(e.target.value)
                }))}
              />
              <p className="text-sm text-muted-foreground">
                Maximum number of concurrent copy trades
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="copy-delay">Copy Trade Delay</Label>
              <Select 
                value={tradingSettings.autoCopyDelay}
                onValueChange={(value) => setTradingSettings(prev => ({
                  ...prev,
                  autoCopyDelay: value
                }))}
              >
                <SelectTrigger id="copy-delay">
                  <SelectValue placeholder="Select delay time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Immediate</SelectItem>
                  <SelectItem value="5">5 seconds</SelectItem>
                  <SelectItem value="10">10 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Delay before automatically copying a new trade
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="default-allocation">Default Allocation</Label>
                <span className="text-sm font-medium">{tradingSettings.defaultAllocation}%</span>
              </div>
              <Slider 
                id="default-allocation"
                min={1} 
                max={100} 
                step={1} 
                value={[tradingSettings.defaultAllocation]}
                onValueChange={handleAllocationChange}
              />
              <p className="text-sm text-muted-foreground">
                Default percentage of your portfolio to allocate to new traders you follow
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Account Settings
            </CardTitle>
            <CardDescription>
              Manage your account preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="AptosTradingFan" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="user@example.com" />
              <p className="text-sm text-muted-foreground">
                Used for notifications and account recovery
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select defaultValue="en">
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="utc">
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                  <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                  <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                  <SelectItem value="gmt">GMT (Greenwich Mean Time)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Secure your account with 2FA
                </p>
              </div>
              <Button variant="outline">Enable 2FA</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Login Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when there's a login to your account
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Transaction Signing</Label>
                <p className="text-sm text-muted-foreground">
                  Require wallet confirmation for all trades
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>
            
            <div className="pt-2">
              <Button variant="outline" className="w-full">
                <AlertCircle className="h-4 w-4 mr-2" />
                View Account Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Save All Settings</Button>
      </div>
    </div>
  );
};

export default Settings;
