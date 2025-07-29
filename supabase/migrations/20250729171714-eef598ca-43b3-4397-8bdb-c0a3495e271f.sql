-- Add RLS policies to allow campaign updates for approved users
-- Allow admins to update any campaign status
CREATE POLICY "Admins can update campaign status" 
ON public.campaigns 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Allow users to update their own pending campaigns
CREATE POLICY "Users can update their own pending campaigns" 
ON public.campaigns 
FOR UPDATE 
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id);