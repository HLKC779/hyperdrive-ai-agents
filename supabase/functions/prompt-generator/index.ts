import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PromptRequest {
  taskType: string;
  context: string;
  role?: string;
  tone?: string;
  outputFormat?: string;
  customRequirements?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { taskType, context, role, tone, outputFormat, customRequirements }: PromptRequest = await req.json();

    console.log('Generating prompt for:', { taskType, context, role, tone });

    const systemPrompt = `You are an expert prompt engineer. Your task is to generate high-quality, effective prompts for AI systems based on the user's requirements.

Focus on creating prompts that are:
- Clear and specific
- Well-structured with proper formatting
- Include relevant context and constraints
- Follow best practices for AI prompt engineering
- Optimized for the specific task type

Generate a complete, ready-to-use prompt that incorporates all the provided parameters.`;

    const userPrompt = `Generate an optimized AI prompt with these specifications:

Task Type: ${taskType}
Context/Domain: ${context}
${role ? `Role/Persona: ${role}` : ''}
${tone ? `Tone/Style: ${tone}` : ''}
${outputFormat ? `Output Format: ${outputFormat}` : ''}
${customRequirements ? `Additional Requirements: ${customRequirements}` : ''}

Please provide:
1. A complete, optimized prompt ready for use
2. A brief explanation of the prompt's key features
3. Suggested improvements or variations

Format your response as JSON with the structure:
{
  "prompt": "The complete optimized prompt",
  "explanation": "Brief explanation of key features",
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "category": "${taskType}",
  "estimatedTokens": estimated_token_count
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
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log('Generated content:', generatedContent);

    // Try to parse as JSON, fallback to simple format if parsing fails
    let result;
    try {
      result = JSON.parse(generatedContent);
    } catch (parseError) {
      console.log('Failed to parse as JSON, creating fallback format');
      result = {
        prompt: generatedContent,
        explanation: "AI-generated prompt based on your specifications",
        suggestions: ["Test with different parameters", "Add more specific context", "Experiment with role variations"],
        category: taskType,
        estimatedTokens: Math.ceil(generatedContent.length / 4)
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in prompt-generator function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to generate prompt. Please check your parameters and try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});