import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are SpazaBudget AI, a friendly money coach for small business owners and households in South Africa. 
Provide practical, actionable budget advice. Keep responses concise and encouraging.
User's question: ${message}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({
      success: true,
      message: responseText,
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
