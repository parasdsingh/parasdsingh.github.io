// Cloudflare Worker for CV Chat Assistant
// Deploy this to Cloudflare Workers and set GROQ_API_KEY as an environment variable

export default {
  async fetch(request, env, ctx) {
    // Handle CORS for all requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST requests to /api/chat
    if (request.method !== 'POST' || !request.url.includes('/api/chat')) {
      return new Response('Not Found', { 
        status: 404,
        headers: corsHeaders
      });
    }

    try {
      const body = await request.json();
      const { message, max_tokens = 300, temperature = 0.7 } = body;

      if (!message) {
        return new Response(JSON.stringify({ error: 'Message is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Call Groq API
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens,
          temperature,
          stream: false
        })
      });

      if (!groqResponse.ok) {
        console.error('Groq API error:', groqResponse.status, await groqResponse.text());
        return new Response(JSON.stringify({ 
          error: 'Failed to get response from AI service' 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const groqData = await groqResponse.json();
      const response = groqData.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

      return new Response(JSON.stringify({ response }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};