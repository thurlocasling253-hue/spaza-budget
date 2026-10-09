import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { area, usage, income } = body;

    // Simple calculation for space-to-cash potential
    const potentialIncome = area * 2 * income * 0.1; // Simplified formula

    return NextResponse.json({
      success: true,
      data: {
        area,
        usage,
        currentIncome: income,
        potentialMonthlyIncome: potentialIncome.toFixed(2),
        recommendations: [
          'Turn the front corner into a small prep-and-sell station.',
          'Use a weekend pop-up model with targeted local products.',
          'Offer repair or value-add services using unused time slots.',
        ],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to analyze space' },
      { status: 400 }
    );
  }
}
