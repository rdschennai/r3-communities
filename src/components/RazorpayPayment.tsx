import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentProps {
  defaultAmount?: number;
}

export function RazorpayPayment({ defaultAmount = 500 }: RazorpayPaymentProps) {
  const [amount, setAmount] = useState(defaultAmount);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const presetAmounts = [100, 250, 500, 1000, 2500];

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!amount || amount < 1) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create order
      const { data: orderData, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount,
          donor_name: donorName,
          donor_email: donorEmail,
        },
      });

      if (error) throw error;

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'R3 Community',
        description: 'Donation to Community Fund',
        order_id: orderData.orderId,
        prefill: {
          name: donorName,
          email: donorEmail,
        },
        theme: {
          color: '#10b981',
        },
        handler: async (response: any) => {
          try {
            // Verify payment
            const { error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            });

            if (verifyError) throw verifyError;

            toast({
              title: 'Payment Successful!',
              description: `Thank you for your donation of ₹${amount}`,
            });

            // Reset form
            setDonorName('');
            setDonorEmail('');
            setAmount(defaultAmount);
          } catch (error: any) {
            toast({
              title: 'Payment Verification Failed',
              description: error.message,
              variant: 'destructive',
            });
          }
        },
        modal: {
          ondismiss: () => {
            toast({
              title: 'Payment Cancelled',
              description: 'You can try again anytime',
              variant: 'destructive',
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast({
        title: 'Payment Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Support Our Community Fund</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="donor-name">Your Name (Optional)</Label>
          <Input
            id="donor-name"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div>
          <Label htmlFor="donor-email">Your Email (Optional)</Label>
          <Input
            id="donor-email"
            type="email"
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div>
          <Label htmlFor="amount">Donation Amount (₹)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Enter amount"
            min="1"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {presetAmounts.map((preset) => (
            <Button
              key={preset}
              variant={amount === preset ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAmount(preset)}
            >
              ₹{preset}
            </Button>
          ))}
        </div>

        <Button
          onClick={handlePayment}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Processing...' : `Donate ₹${amount}`}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Your donation helps us support urgent campaigns and emergency cases in our community.
        </p>
      </CardContent>
    </Card>
  );
}