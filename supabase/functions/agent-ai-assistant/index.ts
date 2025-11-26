import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agents, analysisType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build analysis prompt based on type
    let systemPrompt = "You are an expert AI agent management consultant. Analyze the provided agent data and provide actionable insights.";
    let userPrompt = "";

    switch (analysisType) {
      case 'performance':
        userPrompt = `Analyze these AI agents and identify performance optimization opportunities:
${JSON.stringify(agents, null, 2)}

Provide:
1. Top 3 performance concerns
2. Specific optimization recommendations
3. Resource allocation suggestions
4. Priority actions`;
        break;

      case 'capabilities':
        userPrompt = `Review these AI agents and suggest capability improvements:
${JSON.stringify(agents, null, 2)}

Provide:
1. Missing capabilities analysis
2. Capability enhancement suggestions
3. Cross-agent synergy opportunities
4. New capability recommendations`;
        break;

      case 'optimization':
        userPrompt = `Analyze agent configurations for optimization:
${JSON.stringify(agents, null, 2)}

Provide:
1. Configuration improvement suggestions
2. Workload distribution recommendations
3. Efficiency enhancement opportunities
4. Cost optimization strategies`;
        break;

      case 'health':
        userPrompt = `Assess the health and reliability of these agents:
${JSON.stringify(agents, null, 2)}

Provide:
1. Health status assessment
2. Reliability concerns
3. Preventive maintenance recommendations
4. Risk mitigation strategies`;
        break;

      default:
        userPrompt = `Provide a comprehensive analysis of these AI agents:
${JSON.stringify(agents, null, 2)}

Include performance, capabilities, optimization opportunities, and health assessment.`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content;

    if (!analysis) {
      throw new Error('No analysis generated');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis,
        analysisType,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in agent-ai-assistant:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
