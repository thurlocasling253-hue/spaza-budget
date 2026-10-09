import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request: NextRequest) {
  if (!genAI) {
    return NextResponse.json(
      {
        success: false,
        error: 'Missing GEMINI_API_KEY environment variable.',
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error: 'A message is required.',
        },
        { status: 400 }
      );
    }

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
    console.error('Gemini API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to generate response.',
      },
      { status: 500 }
    );
  }
}
