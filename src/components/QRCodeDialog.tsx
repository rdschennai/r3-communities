import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { QrCode, Download, Upload, Check } from 'lucide-react';
import QRCode from 'qrcode';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface QRCodeDialogProps {
  campaignId: string;
  campaignName: string;
  targetAmount: number;
  onDonationSubmitted: () => void;
  showIPaidButton?: boolean;
}

const QRCodeDialog = ({ campaignId, campaignName, targetAmount, onDonationSubmitted, showIPaidButton = false }: QRCodeDialogProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [donationAmount, setDonationAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [donorMobile, setDonorMobile] = useState<string>('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const upiId = "rajee1924-2@okicici";

  useEffect(() => {
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    try {
      const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(campaignName)}&cu=INR&tn=${encodeURIComponent('Donation for ' + campaignName)}`;
      const qrUrl = await QRCode.toDataURL(upiLink, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive"
      });
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${campaignName}-QR-Code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Code Downloaded",
      description: "QR code has been saved to your device"
    });
  };

  const handleScreenshotUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive"
        });
        return;
      }
      setScreenshot(file);
    }
  };

  const submitDonation = async () => {
    if (!donationAmount || !donorMobile) {
      toast({
        title: "Missing Information",
        description: "Please enter donation amount and mobile number",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Store donation record
      const { error: donationError } = await supabase
        .from('donations')
        .insert({
          amount: amount,
          donor_name: donorName || null,
          donor_email: null,
          status: 'completed',
        });

      if (donationError) {
        throw donationError;
      }

      // Update campaign target amount
      const { data: campaign, error: fetchError } = await supabase
        .from('campaigns')
        .select('target_amount')
        .eq('id', campaignId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      const newTargetAmount = Math.max(0, Number(campaign.target_amount) - amount);

      const { error: updateError } = await supabase
        .from('campaigns')
        .update({ target_amount: newTargetAmount })
        .eq('id', campaignId);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Donation Submitted Successfully!",
        description: `Thank you for your donation of ₹${amount}. The campaign target has been updated.`
      });

      // Reset form
      setDonationAmount('');
      setDonorName('');
      setDonorMobile('');
      setScreenshot(null);
      setShowDonationForm(false);
      onDonationSubmitted();

    } catch (error) {
      console.error('Error submitting donation:', error);
      toast({
        title: "Error",
        description: "Failed to submit donation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
          >
            <QrCode className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            Pay via QR
          </Button>
        </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pay via UPI QR Code</DialogTitle>
        </DialogHeader>
        
        {!showDonationForm ? (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code with any UPI app to donate
              </p>
              <p className="text-xs font-medium text-blue-600 break-all mb-4">
                UPI ID: {upiId}
              </p>
              
              {qrCodeUrl && (
                <div className="flex flex-col items-center space-y-4">
                  <img 
                    src={qrCodeUrl} 
                    alt="UPI QR Code" 
                    className="border rounded-lg shadow-sm"
                  />
                  
                  <Button 
                    onClick={downloadQRCode}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download QR
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Please provide your donation details
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="amount">Donation Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount donated"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={donorMobile}
                  onChange={(e) => setDonorMobile(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="screenshot">Payment Screenshot (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="screenshot"
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('screenshot')?.click()}
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {screenshot ? 'Change Screenshot' : 'Upload Screenshot'}
                  </Button>
                </div>
                {screenshot && (
                  <p className="text-xs text-green-600 mt-1">
                    Screenshot selected: {screenshot.name}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDonationForm(false)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={submitDonation}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Donation'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
    
    {showIPaidButton && (
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
          >
            <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            I Paid
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Your Donation</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Please provide your donation details
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="amount">Donation Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount donated"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={donorMobile}
                  onChange={(e) => setDonorMobile(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="screenshot">Payment Screenshot (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="screenshot"
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('screenshot')?.click()}
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {screenshot ? 'Change Screenshot' : 'Upload Screenshot'}
                  </Button>
                </div>
                {screenshot && (
                  <p className="text-xs text-green-600 mt-1">
                    Screenshot selected: {screenshot.name}
                  </p>
                )}
              </div>

              <Button
                onClick={submitDonation}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Donation'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )}
  </>
  );
};

export default QRCodeDialog;