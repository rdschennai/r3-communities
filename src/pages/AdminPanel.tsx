
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Users, 
  IndianRupee,
  Eye,
  Edit,
  ExternalLink,
  LogOut,
  Heart
} from 'lucide-react';

const AdminPanel = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [approvedCampaigns, setApprovedCampaigns] = useState([]);
  const [totalRaised, setTotalRaised] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check authentication status when component mounts
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCampaigns();
      fetchTotalRaised();
    }
  }, [isAuthenticated]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      // Fetch pending campaigns
      const { data: pending } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'pending');

      // Fetch approved campaigns
      const { data: approved } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'approved');

      setPendingCampaigns(pending || []);
      setApprovedCampaigns(approved || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalRaised = async () => {
    try {
      const { data } = await supabase
        .from('donations')
        .select('amount')
        .eq('status', 'completed');

      const total = data?.reduce((sum, donation) => sum + Number(donation.amount), 0) || 0;
      setTotalRaised(total);
    } catch (error) {
      console.error('Error fetching total raised:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (loginData.username === 'admin' && loginData.password === 'admin123') {
        localStorage.setItem('adminAuthenticated', 'true');
        setIsAuthenticated(true);
        toast({
          title: "Login Successful",
          description: "Welcome to the admin panel",
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid admin credentials",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "Admin session ended"
    });
  };

  const handleCampaignAction = async (campaignId: string, action: 'approve' | 'reject', isEmergency = false) => {
    try {
      if (action === 'approve') {
        const { error } = await supabase
          .from('campaigns')
          .update({ 
            status: 'approved',
            is_emergency: isEmergency
          })
          .eq('id', campaignId);

        if (error) throw error;

        toast({
          title: "Campaign Approved",
          description: "Campaign is now live",
        });
      } else {
        const { error } = await supabase
          .from('campaigns')
          .update({ status: 'rejected' })
          .eq('id', campaignId);

        if (error) throw error;

        toast({
          title: "Campaign Rejected",
          description: "Campaign has been rejected",
        });
      }

      fetchCampaigns();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update campaign",
        variant: "destructive"
      });
    }
  };

  const toggleEmergencyStatus = async (campaignId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ is_emergency: !currentStatus })
        .eq('id', campaignId);

      if (error) throw error;

      toast({
        title: "Emergency Status Updated",
        description: "Campaign priority has been changed",
      });

      fetchCampaigns();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update emergency status",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Button variant="ghost" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                <Heart className="h-4 w-4 mr-2" />
                View Site
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Pending</p>
                  <p className="text-3xl font-bold">{pendingCampaigns.length}</p>
                </div>
                <Clock className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Active</p>
                  <p className="text-3xl font-bold">{approvedCampaigns.length}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Emergency</p>
                  <p className="text-3xl font-bold">
                    {approvedCampaigns.filter(c => c.is_emergency).length}
                  </p>
                </div>
                <AlertTriangle className="h-10 w-10 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Total Raised</p>
                  <p className="text-2xl font-bold">₹{(totalRaised / 100000).toFixed(1)}L</p>
                </div>
                <IndianRupee className="h-10 w-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending Campaigns</TabsTrigger>
            <TabsTrigger value="active">Active Campaigns</TabsTrigger>
            <TabsTrigger value="fund">Community Fund</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Pending Approvals</h2>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {pendingCampaigns.length} campaigns waiting
              </Badge>
            </div>

            <div className="grid gap-6">
              {pendingCampaigns.map((campaign) => (
                <Card key={campaign.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{campaign.name}</CardTitle>
                        <p className="text-gray-600">For: {campaign.beneficiary_name || 'Self'}</p>
                        <p className="text-sm text-gray-500">Submitted: {new Date(campaign.created_at).toLocaleDateString()}</p>
                      </div>
                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">{campaign.story}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Target Amount</p>
                        <p className="font-semibold text-green-600">₹{Number(campaign.target_amount).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">UPI ID</p>
                        <p className="font-mono text-sm">{campaign.upi_id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Contact</p>
                        <p className="font-mono text-sm">{campaign.phone}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4">
                      <Button 
                        onClick={() => handleCampaignAction(campaign.id, 'approve', false)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        onClick={() => handleCampaignAction(campaign.id, 'approve', true)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Approve as Emergency
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleCampaignAction(campaign.id, 'reject')}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {pendingCampaigns.length === 0 && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">All Caught Up!</h3>
                    <p className="text-gray-600">No pending campaigns to review at the moment.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Active Campaigns</h2>
              <Badge variant="outline" className="text-green-600 border-green-200">
                {approvedCampaigns.length} campaigns live
              </Badge>
            </div>

            <div className="grid gap-6">
              {approvedCampaigns.map((campaign) => (
                <Card key={campaign.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{campaign.name}</CardTitle>
                        <p className="text-gray-600">For: {campaign.beneficiary_name || 'Self'}</p>
                        <p className="text-sm text-gray-500">Approved: {new Date(campaign.updated_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        {campaign.is_emergency && (
                          <Badge className="bg-red-500 hover:bg-red-600">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Emergency
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{campaign.story}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Target Amount</p>
                        <p className="font-semibold text-green-600">₹{Number(campaign.target_amount).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">UPI ID</p>
                        <p className="font-mono text-sm">{campaign.upi_id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Contact</p>
                        <p className="font-mono text-sm">{campaign.phone}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button 
                        variant="outline"
                        onClick={() => toggleEmergencyStatus(campaign.id, campaign.is_emergency)}
                        className={campaign.is_emergency ? "border-red-200 text-red-600" : "border-orange-200 text-orange-600"}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        {campaign.is_emergency ? 'Remove Emergency' : 'Mark Emergency'}
                      </Button>
                      <Button variant="outline" onClick={() => navigate(`/campaign/${campaign.id}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Public
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fund" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Community Fund Management</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Central Fund Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Collected:</span>
                      <span className="font-bold">₹45,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distributed:</span>
                      <span className="font-bold">₹12,000</span>
                    </div>
                    <div className="flex justify-between border-t border-white/20 pt-2">
                      <span>Available:</span>
                      <span className="font-bold text-xl">₹33,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Razorpay Dashboard
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <IndianRupee className="h-4 w-4 mr-2" />
                      Create Emergency Disbursement
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Generate Fund Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Recent Fund Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div>
                      <p className="font-medium">Emergency top-up for Rajesh Kumar</p>
                      <p className="text-sm text-gray-600">Medical emergency fund disbursement</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">-₹5,000</p>
                      <p className="text-xs text-gray-500">Jan 12, 2024</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div>
                      <p className="font-medium">Community donation via Razorpay</p>
                      <p className="text-sm text-gray-600">Anonymous donor contribution</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">+₹1,000</p>
                      <p className="text-xs text-gray-500">Jan 11, 2024</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
