
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Upload, IndianRupee, User, Phone, FileText } from 'lucide-react';

const SubmitCampaign = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    campaignerName: '',
    beneficiaryName: '',
    story: '',
    targetAmount: '',
    upiId: '',
    bankAccount: '',
    ifscCode: '',
    phoneNumber: '',
    photo: null as File | null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual Supabase integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Campaign Submitted Successfully!",
        description: "Your story has been submitted for review. You'll be notified once it's approved.",
      });

      // Reset form
      setFormData({
        campaignerName: '',
        beneficiaryName: '',
        story: '',
        targetAmount: '',
        upiId: '',
        bankAccount: '',
        ifscCode: '',
        phoneNumber: '',
        photo: null
      });

      // Redirect to home after a delay
      setTimeout(() => navigate('/'), 1500);
      
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support if the problem persists.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-blue-600 fill-current" />
              <span className="text-xl font-bold text-gray-800">Community Care</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Share Your Story
            </h1>
            <p className="text-lg text-gray-600">
              Every story matters. Share yours with our community and let us help you achieve your goals.
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-800">
                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                Campaign Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaignerName" className="text-sm font-medium text-gray-700">
                      Your Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="campaignerName"
                        name="campaignerName"
                        value={formData.campaignerName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="pl-10 border-gray-200 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="beneficiaryName" className="text-sm font-medium text-gray-700">
                      Beneficiary Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="beneficiaryName"
                        name="beneficiaryName"
                        value={formData.beneficiaryName}
                        onChange={handleInputChange}
                        placeholder="If different from your name"
                        className="pl-10 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Story */}
                <div className="space-y-2">
                  <Label htmlFor="story" className="text-sm font-medium text-gray-700">
                    Your Story * (Max 500 characters)
                  </Label>
                  <Textarea
                    id="story"
                    name="story"
                    value={formData.story}
                    onChange={handleInputChange}
                    placeholder="Tell us about your situation and why you need support..."
                    className="min-h-32 border-gray-200 focus:border-blue-500 resize-none"
                    maxLength={500}
                    required
                  />
                  <div className="text-right text-xs text-gray-500">
                    {formData.story.length}/500 characters
                  </div>
                </div>

                {/* Target Amount */}
                <div className="space-y-2">
                  <Label htmlFor="targetAmount" className="text-sm font-medium text-gray-700">
                    Target Amount (₹) *
                  </Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="targetAmount"
                      name="targetAmount"
                      type="number"
                      value={formData.targetAmount}
                      onChange={handleInputChange}
                      placeholder="25000"
                      className="pl-10 border-gray-200 focus:border-blue-500"
                      min="100"
                      required
                    />
                  </div>
                </div>

                {/* Payment Details */}
                <div className="bg-blue-50 p-6 rounded-lg space-y-4">
                  <h3 className="font-semibold text-gray-800 mb-4">Payment Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="upiId" className="text-sm font-medium text-gray-700">
                      UPI ID (Recommended)
                    </Label>
                    <Input
                      id="upiId"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      placeholder="yourname@paytm or yourname@gpay"
                      className="border-gray-200 focus:border-blue-500"
                    />
                  </div>

                  <div className="text-center text-sm text-gray-600 my-3">OR</div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankAccount" className="text-sm font-medium text-gray-700">
                        Bank Account Number
                      </Label>
                      <Input
                        id="bankAccount"
                        name="bankAccount"
                        value={formData.bankAccount}
                        onChange={handleInputChange}
                        placeholder="Account number"
                        className="border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ifscCode" className="text-sm font-medium text-gray-700">
                        IFSC Code
                      </Label>
                      <Input
                        id="ifscCode"
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={handleInputChange}
                        placeholder="IFSC code"
                        className="border-gray-200 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                    Phone Number * (Private - for admin contact only)
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="pl-10 border-gray-200 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="photo" className="text-sm font-medium text-gray-700">
                    Photo (Optional)
                  </Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-sm text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </div>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('photo')?.click()}
                    >
                      Choose File
                    </Button>
                    {formData.photo && (
                      <div className="mt-2 text-sm text-green-600">
                        File selected: {formData.photo.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Campaign
                        <Heart className="ml-2 h-5 w-5 fill-current" />
                      </>
                    )}
                  </Button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                  <div className="text-sm text-yellow-800">
                    <strong>Note:</strong> Your campaign will be reviewed by our admin team before going live. 
                    This typically takes 24-48 hours. You'll be notified once your campaign is approved.
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubmitCampaign;
