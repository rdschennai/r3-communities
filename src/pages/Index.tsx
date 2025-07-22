
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Zap, ArrowRight, Copy, QrCode, LogOut, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';


const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [featuredCampaigns] = useState([
    {
      id: 1,
      name: "Help Rajesh's Medical Treatment",
      beneficiary: "Rajesh Kumar",
      story: "Father of two needs urgent surgery. Local treatments failed, specialized care required in Mumbai. Family struggling with medical bills.",
      target: 50000,
      raised: 23000,
      upiId: "rajesh.kumar@paytm",
      isEmergency: true,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Education Fund for Priya",
      beneficiary: "Priya Sharma",
      story: "Brilliant student from rural area got admission to engineering college but family cannot afford fees. Dreams of becoming software engineer.",
      target: 25000,
      raised: 8500,
      upiId: "priya.education@gpay",
      isEmergency: false,
      image: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Flood Relief for Village",
      beneficiary: "Gram Panchayat Shivpur",
      story: "Recent floods destroyed 50+ homes. Community needs immediate relief supplies, temporary shelter materials, and clean water facilities.",
      target: 75000,
      raised: 45000,
      upiId: "relief.shivpur@bhim",
      isEmergency: true,
      image: "/placeholder.svg"
    }
  ]);

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

    return () => subscription.unsubscribe();
  }, []);

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
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600 fill-current" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Community Care
              </h1>
            </div>
            <nav className="flex space-x-2 md:space-x-6 items-center">
              {user ? (
                <>
                  <Button variant="ghost" size="sm" className="hidden md:inline-flex" onClick={() => navigate('/submit')}>Submit Campaign</Button>
                  <Button variant="ghost" size="sm" className="hidden md:inline-flex" onClick={() => navigate('/admin')}>Admin</Button>
                  <span className="text-sm text-gray-600 hidden md:inline">Welcome, {user.email}</span>
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
              {user && (
                <div className="md:hidden flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate('/submit')}>Submit</Button>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>Admin</Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-700 via-purple-600 to-green-600 bg-clip-text text-transparent leading-tight">
              Together We Build Dreams
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              A community-driven platform where every story matters. Support individual campaigns directly 
              or contribute to our emergency fund that helps urgent cases across the community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg px-8 py-3"
                onClick={() => user ? navigate('/submit') : navigate('/auth')}
              >
                {user ? 'Share Your Story' : 'Login to Share Story'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-blue-300 text-blue-700 hover:bg-blue-50 text-lg px-8 py-3"
              >
                Browse Campaigns
                <Users className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-600">150+</div>
              <div className="text-gray-600">Lives Impacted</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-600">₹2.5L+</div>
              <div className="text-gray-600">Funds Raised</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-600">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-4 text-gray-800">Urgent Stories</h3>
            <p className="text-xl text-gray-600">These campaigns need your immediate support</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <div className="relative">
                  <img 
                    src={campaign.image} 
                    alt={campaign.name}
                    className="w-full h-48 object-cover"
                  />
                  {campaign.isEmergency && (
                    <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">
                      <Zap className="h-3 w-3 mr-1" />
                      Urgent
                    </Badge>
                  )}
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">{campaign.name}</CardTitle>
                  <p className="text-sm text-gray-600">For: {campaign.beneficiary}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-700 text-sm leading-relaxed">{campaign.story}</p>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-green-600">₹{campaign.raised.toLocaleString()}</span>
                      <span className="text-gray-500">₹{campaign.target.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((campaign.raised / campaign.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round((campaign.raised / campaign.target) * 100)}% funded
                    </div>
                  </div>
                  
                  {/* UPI Payment Section */}
                  <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                    <div className="text-sm font-medium text-blue-800">UPI ID: {campaign.upiId}</div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-100"
                        onClick={() => copyUpiId(campaign.upiId, campaign.name)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy UPI
                      </Button>
                      <Button 
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => openUpiApp(campaign.upiId, 100, campaign.beneficiary)}
                      >
                        <QrCode className="h-4 w-4 mr-1" />
                        Pay ₹100
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Fund Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Heart className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Support Our Community Fund
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Help us support urgent community needs and emergency medical cases. Every donation makes a difference in someone's life.
            </p>
            <Button 
              size="lg"
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => window.open('https://razorpay.me/@R3Foundation', '_blank')}
            >
              Donate Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6 fill-current text-blue-400" />
                <span className="text-xl font-bold">Community Care</span>
              </div>
              <p className="text-gray-400">
                Building a stronger community through collective support and shared compassion.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-gray-400">
                <div className="hover:text-white cursor-pointer">Submit Campaign</div>
                <div className="hover:text-white cursor-pointer">Browse Stories</div>
                <div className="hover:text-white cursor-pointer">About Us</div>
                <div className="hover:text-white cursor-pointer">Contact</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <div>help@communitycare.org</div>
                <div>+91 98765 43210</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Community Care. Building dreams together.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
