import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { keywords, mode, existingStory } = await req.json();

    let prompt = '';
    
    if (mode === 'keywords') {
      prompt = `Write a compelling 400-500 character fundraising story based on these keywords: ${keywords}. 
      The story should be personal, emotional, and explain why financial help is needed. 
      Make it authentic and relatable. Focus on the human element and urgency.
      Keep it under 500 characters including spaces.`;
    } else if (mode === 'fill') {
      prompt = `Complete and improve this fundraising story: "${existingStory}"
      Make it more compelling and emotional while staying under 500 characters total.
      Fill in missing details that would make donors want to help.
      Keep the existing tone and style but make it more engaging.`;
    } else {
      prompt = `Write a compelling 400-500 character fundraising story for a medical emergency or personal crisis.
      Make it personal, emotional, and explain the urgent need for financial help.
      Include specific details that make it authentic and relatable.
      Keep it under 500 characters including spaces.`;
    }

    console.log('Making request to OpenAI with prompt:', prompt);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a compassionate storyteller helping people create authentic fundraising stories. Write in first person, be genuine and heartfelt. Always respond with just the story text, nothing else.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    console.log('OpenAI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI response data:', JSON.stringify(data, null, 2));
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('Invalid response from OpenAI API');
    }
    
    const generatedStory = data.choices[0].message.content.trim();

    // Ensure story is under 500 characters
    const trimmedStory = generatedStory.length > 500 
      ? generatedStory.substring(0, 497) + '...'
      : generatedStory;

    return new Response(JSON.stringify({ story: trimmedStory }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-story function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});