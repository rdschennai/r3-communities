-- Create campaigns table for storing campaign submissions
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  beneficiary_name TEXT,
  story TEXT NOT NULL,
  target_amount DECIMAL(10,2) NOT NULL,
  upi_id TEXT NOT NULL,
  phone TEXT NOT NULL,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  is_emergency BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies for campaigns
CREATE POLICY "Anyone can view approved campaigns" 
ON public.campaigns 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Anyone can insert campaigns" 
ON public.campaigns 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_campaigns_updated_at
BEFORE UPDATE ON public.campaigns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create donations table for tracking community fund donations
CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  razorpay_payment_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  donor_email TEXT,
  donor_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Create policies for donations (admin only for now)
CREATE POLICY "Admin can view all donations" 
ON public.donations 
FOR ALL 
USING (true);

CREATE POLICY "Anyone can insert donations" 
ON public.donations 
FOR INSERT 
WITH CHECK (true);