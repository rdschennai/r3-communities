
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
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
  const [pendingCampaigns, setPendingCampaigns] = useState([
    {
      id: 1,
      campaignerName: "Amit Verma",
      beneficiaryName: "Same",
      story: "Need urgent funds for my mother's cardiac surgery. Local hospital lacks proper equipment and specialist suggested treatment in Delhi. Family exhausted all savings on initial tests and medications.",
      targetAmount: 75000,
      upiId: "amit.verma@paytm",
      phoneNumber: "+91 98765 43210",
      submittedAt: "2024-01-15",
      status: "pending"
    },
    {
      id: 2,
      campaignerName: "Dr. Sarah Khan",
      beneficiaryName: "Rural Health Center",
      story: "Medical camp needs portable equipment and medicines for tribal area. 500+ families have no access to basic healthcare. Government approvals ready, just need funding for equipment.",
      targetAmount: 50000,
      upiId: "healthcamp.tribal@bhim",
      phoneNumber: "+91 87654 32109",
      submittedAt: "2024-01-14",
      status: "pending"
    }
  ]);

  const [approvedCampaigns, setApprovedCampaigns] = useState([
    {
      id: 3,
      campaignerName: "Rajesh Kumar",
      beneficiaryName: "Same",
      story: "Father of two needs urgent surgery. Local treatments failed, specialized care required in Mumbai.",
      targetAmount: 50000,
      currentAmount: 23000,
      upiId: "rajesh.kumar@paytm",
      isEmergency: true,
      status: "active",
      approvedAt: "2024-01-10"
    }
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication - replace with proper auth
    if (loginData.username === 'admin' && loginData.password === 'admin123') {
      setIsAuthenticated(true);
      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive"
      });
    }
  };

  const handleCampaignAction = (campaignId: number, action: 'approve' | 'reject', isEmergency = false) => {
    const campaign = pendingCampaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    if (action === 'approve') {
      const approvedCampaign = {
        ...campaign,
        status: 'active',
        currentAmount: 0,
        isEmergency,
        approvedAt: new Date().toISOString().split('T')[0]
      };
      setApprovedCampaigns(prev => [...prev, approvedCampaign]);
      toast({
        title: "Campaign Approved",
        description: `${campaign.campaignerName}'s campaign is now live`,
      });
    } else {
      toast({
        title: "Campaign Rejected",
        description: `${campaign.campaignerName}'s campaign has been rejected`,
      });
    }

    setPendingCampaigns(prev => prev.filter(c => c.id !== campaignId));
  };

  const toggleEmergencyStatus = (campaignId: number) => {
    setApprovedCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, isEmergency: !campaign.isEmergency }
          : campaign
      )
    );
    toast({
      title: "Emergency Status Updated",
      description: "Campaign priority has been changed",
    });
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
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Login
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
              <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
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
                    {approvedCampaigns.filter(c => c.isEmergency).length}
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
                  <p className="text-2xl font-bold">₹2.5L+</p>
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
                        <CardTitle className="text-lg">{campaign.campaignerName}</CardTitle>
                        <p className="text-gray-600">For: {campaign.beneficiaryName}</p>
                        <p className="text-sm text-gray-500">Submitted: {campaign.submittedAt}</p>
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
                        <p className="font-semibold text-green-600">₹{campaign.targetAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">UPI ID</p>
                        <p className="font-mono text-sm">{campaign.upiId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Contact</p>
                        <p className="font-mono text-sm">{campaign.phoneNumber}</p>
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
                        <CardTitle className="text-lg">{campaign.campaignerName}</CardTitle>
                        <p className="text-gray-600">For: {campaign.beneficiaryName}</p>
                        <p className="text-sm text-gray-500">Approved: {campaign.approvedAt}</p>
                      </div>
                      <div className="flex gap-2">
                        {campaign.isEmergency && (
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
                    
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-green-600">₹{campaign.currentAmount?.toLocaleString()}</span>
                        <span className="text-gray-500">₹{campaign.targetAmount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min(((campaign.currentAmount || 0) / campaign.targetAmount) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round(((campaign.currentAmount || 0) / campaign.targetAmount) * 100)}% funded
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button 
                        variant="outline"
                        onClick={() => toggleEmergencyStatus(campaign.id)}
                        className={campaign.isEmergency ? "border-red-200 text-red-600" : "border-orange-200 text-orange-600"}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        {campaign.isEmergency ? 'Remove Emergency' : 'Mark Emergency'}
                      </Button>
                      <Button variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline">
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
