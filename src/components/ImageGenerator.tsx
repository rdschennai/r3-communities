import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Wand2 } from 'lucide-react';

interface ImageGeneratorProps {
  prompt: string;
  onImageGenerated: (imageUrl: string) => void;
  disabled?: boolean;
}

const ImageGenerator = ({ prompt, onImageGenerated, disabled }: ImageGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Cannot generate image without a description",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Call Supabase Edge Function for image generation
      const response = await fetch('/functions/v1/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${prompt} - donation campaign, helping people, community support, realistic photo style`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      
      if (data.image) {
        onImageGenerated(data.image);
        toast({
          title: "Image Generated",
          description: "Campaign image has been generated successfully"
        });
      } else {
        throw new Error('No image returned from generator');
      }

    } catch (error) {
      console.error('Error generating image:', error);
      
      // Fallback to a placeholder image based on campaign type
      const fallbackImage = getFallbackImage(prompt);
      onImageGenerated(fallbackImage);
      
      toast({
        title: "Using Placeholder",
        description: "Image generation failed, using a relevant placeholder image"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getFallbackImage = (prompt: string): string => {
    const text = prompt.toLowerCase();
    
    if (text.includes('medical') || text.includes('health') || text.includes('treatment') || text.includes('surgery')) {
      return 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400&h=300&fit=crop';
    } else if (text.includes('education') || text.includes('school') || text.includes('study') || text.includes('student')) {
      return 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=300&fit=crop';
    } else if (text.includes('emergency') || text.includes('urgent') || text.includes('accident')) {
      return 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop';
    } else if (text.includes('child') || text.includes('children') || text.includes('kid')) {
      return 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop';
    } else if (text.includes('family') || text.includes('home') || text.includes('house')) {
      return 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop';
    } else {
      return 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop';
    }
  };

  return (
    <Button
      onClick={generateImage}
      disabled={disabled || isGenerating}
      variant="outline"
      size="sm"
      className="h-8"
    >
      <Wand2 className="h-3 w-3 mr-1" />
      {isGenerating ? 'Generating...' : 'Generate Image'}
    </Button>
  );
};

export default ImageGenerator;