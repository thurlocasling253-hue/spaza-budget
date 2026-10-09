import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Production deployment checklist:
 * 
 * 1. SET ENVIRONMENT VARIABLES (Vercel/GitHub Settings → Environment Variables)
 *    - GEMINI_API_KEY=your_actual_key_here
 * 
 * 2. VERIFY DEPLOYMENT
 *    - Route: /api/chat (POST only)
 *    - Model: gemini-1.5-flash
 *    - Runtime: Node.js
 * 
 * 3. TEST IN PRODUCTION
 *    - Open app at https://spaza-budget.vercel.app
 *    - Click "Spaza AI Advisor" button
 *    - Send: "How can I reduce food costs?"
 *    - Verify: Response appears (not error)
 * 
 * 4. MONITOR LOGS
 *    - Vercel Dashboard → Function Logs
 *    - Watch for: "Missing GEMINI_API_KEY" or API errors
 * 
 * For issues: Check GitHub at https://github.com/thurlocasling253-hue/spaza-budget
 */

export async function POST(request: NextRequest) {
  // Check if API key is configured
  if (!genAI) {
    console.error('[DEPLOYMENT_ISSUE] Missing GEMINI_API_KEY environment variable');
    return NextResponse.json(
      {
        success: false,
        error: 'AI service not configured. Check deployment environment variables.',
        deploymentHelper: 'Set GEMINI_API_KEY in Vercel Settings → Environment Variables',
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    // Validate input
    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error: 'A message is required.',
        },
        { status: 400 }
      );
    }

    // Initialize Gemini model with safety settings
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    const prompt = `You are SpazaBudget AI, a friendly and practical money coach for South African households and small business owners.
Give clear, concise, actionable budgeting advice.
Keep the answer easy to understand, encouraging, and specific.

User question: ${message}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({
      success: true,
      message: responseText,
    });
  } catch (error: any) {
    console.error('[GEMINI_API_ERROR]', error?.message || error);

    // Return detailed error for debugging
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to generate response.',
        troubleshoot: 'Check GitHub logs: https://github.com/thurlocasling253-hue/spaza-budget',
      },
      { status: 500 }
    );
  }
}
