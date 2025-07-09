import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { leadData, channel, messageType, tone, customPrompt } = await req.json();

    if (!leadData || !channel || !messageType || !tone) {
      throw new Error('Missing required fields');
    }

    const systemPrompt = `You are an expert outreach specialist. Generate personalized ${channel} messages that are:
- ${tone} in tone
- Tailored to the ${leadData.industry} industry
- Appropriate for ${messageType} message type
- Personalized for ${leadData.name} at ${leadData.company}
- Professional and engaging
- Designed to get responses

For emails, include a subject line. For LinkedIn, keep under 300 characters. For social media, be concise and engaging.`;

    const userPrompt = `Generate a ${messageType} ${channel} message for:
Name: ${leadData.name}
Company: ${leadData.company}
Title: ${leadData.title}
Industry: ${leadData.industry}

${customPrompt ? `Additional instructions: ${customPrompt}` : ''}

Format the response as JSON with the following structure:
{
  "subject": "subject line (for emails only)",
  "content": "message content"
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    try {
      const parsedMessage = JSON.parse(generatedText);
      return new Response(JSON.stringify(parsedMessage), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch {
      // Fallback if JSON parsing fails
      return new Response(JSON.stringify({
        subject: channel === 'email' ? `Quick question about ${leadData.company}` : null,
        content: generatedText
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in generate-message function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});