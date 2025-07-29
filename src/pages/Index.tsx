
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Zap, ArrowRight, Copy, QrCode, LogOut, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface Campaign {
  id: string;
  name: string;
  beneficiary_name: string | null;
  story: string;
  target_amount: number;
  upi_id: string;
  is_emergency: boolean;
  photo_url: string | null;
  created_at: string;
}

interface Stats {
  totalCampaigns: number;
  totalRaised: number;
  successRate: number;
}


const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCampaigns: 0,
    totalRaised: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Load campaigns and stats
    loadCampaigns();
    loadStats();

    return () => subscription.unsubscribe();
  }, []);

  const loadCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'approved')
        .order('is_emergency', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to load campaigns",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Get total campaigns
      const { count: totalCampaigns } = await supabase
        .from('campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      // Get total raised (this would need a donations table to be accurate)
      // For now, we'll use a placeholder or calculate from campaign data
      const { data: donations } = await supabase
        .from('donations')
        .select('amount')
        .eq('status', 'completed');

      const totalRaised = donations?.reduce((sum, donation) => sum + Number(donation.amount), 0) || 0;

      setStats({
        totalCampaigns: totalCampaigns || 0,
        totalRaised,
        successRate: totalCampaigns > 0 ? Math.round((totalCampaigns / (totalCampaigns + 1)) * 100) : 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully"
      });
    }
  };

  const copyUpiId = (upiId: string, campaignName: string) => {
    navigator.clipboard.writeText(upiId);
    toast({
      title: "UPI ID Copied!",
      description: `UPI ID for ${campaignName} copied to clipboard`,
    });
  };

  const openUpiApp = (upiId: string, amount: number, name: string) => {
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Donation for ' + name)}`;
    window.open(upiLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 fill-current" />
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Community Care
              </h1>
            </div>
            <nav className="flex items-center gap-1 sm:gap-2">
              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>Admin</Button>
                {user ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/submit')}>Submit Campaign</Button>
                    <span className="text-sm text-gray-600">Welcome, {user.email?.split('@')[0]}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/auth')}
                  >
                    <LogIn className="h-4 w-4 mr-1" />
                    Login
                  </Button>
                )}
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  onClick={() => window.open('https://razorpay.me/@R3Foundation', '_blank')}
                >
                  Support Fund
                </Button>
              </div>
              
              {/* Mobile Navigation */}
              <div className="lg:hidden flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
                  <span className="hidden sm:inline">Admin</span>
                  <span className="sm:hidden text-xs">A</span>
                </Button>
                {user ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/submit')}>
                      <span className="hidden sm:inline">Submit</span>
                      <span className="sm:hidden text-xs">S</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline ml-1">Out</span>
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/auth')}
                  >
                    <LogIn className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline ml-1">Login</span>
                  </Button>
                )}
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-xs sm:text-sm px-2 sm:px-3"
                  onClick={() => window.open('https://razorpay.me/@R3Foundation', '_blank')}
                >
                  <span className="hidden sm:inline">Support</span>
                  <span className="sm:hidden">₹</span>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 text-center">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-blue-700 via-purple-600 to-green-600 bg-clip-text text-transparent leading-tight">
              Together We Build Dreams
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2">
              A community-driven platform where every story matters. Support individual campaigns directly 
              or contribute to our emergency fund that helps urgent cases across the community.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto"
                onClick={() => user ? navigate('/submit') : navigate('/auth')}
              >
                {user ? 'Share Your Story' : 'Login to Share Story'}
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-blue-300 text-blue-700 hover:bg-blue-50 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto"
              >
                Browse Campaigns
                <Users className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="space-y-1 sm:space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600">{stats.totalCampaigns}+</div>
              <div className="text-sm sm:text-base text-gray-600">Active Campaigns</div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-green-600">₹{stats.totalRaised > 0 ? (stats.totalRaised / 100000).toFixed(1) + 'L' : '0'}</div>
              <div className="text-sm sm:text-base text-gray-600">Funds Raised</div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-purple-600">{stats.successRate}%</div>
              <div className="text-sm sm:text-base text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-gray-800">Active Campaigns</h3>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">Support these verified campaigns in need</p>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-600">Loading campaigns...</div>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-600">No active campaigns at the moment.</div>
              <Button 
                className="mt-4"
                onClick={() => user ? navigate('/submit') : navigate('/auth')}
              >
                {user ? 'Submit a Campaign' : 'Login to Submit Campaign'}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <div className="relative">
                    <img 
                      src={campaign.photo_url || "/placeholder.svg"} 
                      alt={campaign.name}
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    {campaign.is_emergency && (
                      <Badge className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-500 hover:bg-red-600 text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                  </div>
                  
                  <CardHeader className="p-3 sm:p-6">
                    <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 leading-tight">{campaign.name}</CardTitle>
                    {campaign.beneficiary_name && (
                      <p className="text-xs sm:text-sm text-gray-600">For: {campaign.beneficiary_name}</p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed line-clamp-3">{campaign.story}</p>
                    
                    {/* Target Amount Display */}
                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="font-medium text-blue-600">Target Amount</span>
                        <span className="text-gray-500">₹{Number(campaign.target_amount).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {/* UPI Payment Section */}
                    <div className="bg-blue-50 p-3 sm:p-4 rounded-lg space-y-2 sm:space-y-3">
                      <div className="text-xs sm:text-sm font-medium text-blue-800 break-all">UPI ID: {campaign.upi_id}</div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-100 text-xs sm:text-sm"
                          onClick={() => copyUpiId(campaign.upi_id, campaign.name)}
                        >
                          <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Copy UPI
                        </Button>
                        <Button 
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
                          onClick={() => openUpiApp(campaign.upi_id, 100, campaign.beneficiary_name || 'Beneficiary')}
                        >
                          <QrCode className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Pay ₹100
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Community Fund Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <Heart className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 sm:mb-6 opacity-90" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
              Support Our Community Fund
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 px-4 sm:px-0">
              Help us support urgent community needs and emergency medical cases. Every donation makes a difference in someone's life.
            </p>
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 text-sm sm:text-base px-6 sm:px-8"
              onClick={() => window.open('https://razorpay.me/@R3Foundation', '_blank')}
            >
              Donate Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2 mb-4">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 fill-current text-blue-400" />
                <span className="text-lg sm:text-xl font-bold">Community Care</span>
              </div>
              <p className="text-gray-400 text-sm sm:text-base">
                Building a stronger community through collective support and shared compassion.
              </p>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
              <div className="space-y-1 sm:space-y-2 text-gray-400 text-sm">
                <div className="hover:text-white cursor-pointer">Submit Campaign</div>
                <div className="hover:text-white cursor-pointer">Browse Stories</div>
                <div className="hover:text-white cursor-pointer">About Us</div>
                <div className="hover:text-white cursor-pointer">Contact</div>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact</h4>
              <div className="space-y-1 sm:space-y-2 text-gray-400 text-sm">
                <div>help@communitycare.org</div>
                <div>+91 98765 43210</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-xs sm:text-sm">&copy; 2024 Community Care. Building dreams together.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
