import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Story templates for different categories
const getStoryTemplate = (keywords: string, mode: string, existingStory?: string) => {
  const text = keywords?.toLowerCase() || existingStory?.toLowerCase() || '';
  
  if (mode === 'fill' && existingStory) {
    // For fill mode, enhance the existing story
    return `${existingStory.trim()} Please help us with your generous donation. Every contribution makes a difference in this critical time. Your support means everything to us.`;
  }
  
  // Generate story based on keywords
  if (text.includes('medical') || text.includes('health') || text.includes('treatment') || text.includes('surgery') || text.includes('hospital')) {
    return `I am facing a critical medical emergency and urgently need financial help for treatment. The medical expenses are overwhelming and beyond our family's capacity. Every rupee you contribute will directly help save a life. Please consider donating to help us through this difficult time. Your kindness can make the difference between life and hope.`;
  } else if (text.includes('education') || text.includes('school') || text.includes('study') || text.includes('student') || text.includes('college')) {
    return `I need urgent financial assistance to continue my education. Due to family financial crisis, I cannot afford the fees and may have to discontinue my studies. Education is my only hope for a better future. Please help me pursue my dreams with your generous contribution. Your support will change my entire life.`;
  } else if (text.includes('emergency') || text.includes('urgent') || text.includes('accident') || text.includes('crisis')) {
    return `Our family is facing an unexpected emergency situation that requires immediate financial help. We have exhausted all our savings and resources. This is our last hope to overcome this crisis. Please consider donating to help us get back on our feet. Your support during this difficult time means everything to us.`;
  } else if (text.includes('child') || text.includes('children') || text.includes('kid') || text.includes('baby')) {
    return `My child is in urgent need of medical care that we cannot afford. As a parent, watching your child suffer while being unable to help is heartbreaking. Please help us save our child's life with your generous donation. Every contribution brings hope and healing. Your kindness can give our child a chance at a healthy future.`;
  } else if (text.includes('family') || text.includes('home') || text.includes('house') || text.includes('debt')) {
    return `Our family is going through severe financial hardship and we desperately need help to survive. We have lost our primary source of income and struggling to meet basic needs. Please consider helping us with your generous contribution. Your support will help us rebuild our lives and provide hope for a better tomorrow.`;
  } else {
    return `I am reaching out during one of the most difficult times in my life, seeking financial help for an urgent situation. Despite trying everything possible, we need community support to overcome this crisis. Please consider donating to help us through this challenging period. Your generosity will bring hope and relief to our family.`;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { keywords, mode, existingStory } = await req.json();

    console.log('Generating story with keywords:', keywords, 'mode:', mode);

    // Generate story using templates (no API needed)
    let generatedStory = getStoryTemplate(keywords || '', mode, existingStory);

    // Add some variation based on keywords
    if (keywords && mode === 'keywords') {
      const keywordList = keywords.split(',').map((k: string) => k.trim()).filter(Boolean);
      if (keywordList.length > 0) {
        // Add specific keywords to make it more relevant
        const firstKeyword = keywordList[0];
        generatedStory = generatedStory.replace('urgent situation', `urgent ${firstKeyword} situation`);
      }
    }

    // Ensure story is under 500 characters
    const trimmedStory = generatedStory.length > 500 
      ? generatedStory.substring(0, 497) + '...'
      : generatedStory;

    console.log('Generated story:', trimmedStory);

    return new Response(JSON.stringify({ story: trimmedStory }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-story function:', error);
    
    // Fallback story in case of any error
    const fallbackStory = "I am facing a difficult situation and need your help. Please consider supporting our cause with your generous donation. Every contribution makes a difference and brings hope to our family during this challenging time.";
    
    return new Response(JSON.stringify({ story: fallbackStory }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});