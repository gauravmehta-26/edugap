import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import UserResult from '@/models/UserResult';

interface SaveResultRequest {
  email: string;
  failureRisk: number;
  weakConcepts: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: SaveResultRequest = await request.json();
    
    // Validate input
    if (!body.email || typeof body.failureRisk !== 'number' || !Array.isArray(body.weakConcepts)) {
      return NextResponse.json(
        { error: 'Invalid request: email, failureRisk, and weakConcepts required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Try to connect to database
    await connectDB();

    // If database is not connected, return success anyway (graceful degradation)
    if (!isDBConnected()) {
      console.log('Database not available. Result not saved but returning success for demo.');
      return NextResponse.json({
        success: true,
        message: 'Result processed successfully',
        saved: false,
      }, { status: 200 });
    }

    // Save to database
    const userResult = new UserResult({
      email: body.email,
      failureRisk: body.failureRisk,
      weakConcepts: body.weakConcepts,
      createdAt: new Date(),
    });

    await userResult.save();

    return NextResponse.json({
      success: true,
      message: 'Result saved successfully',
      saved: true,
      id: userResult._id,
    }, { status: 201 });

  } catch (error) {
    console.error('Error in /api/saveResult:', error);
    
    // Return success even on error for demo stability
    return NextResponse.json({
      success: true,
      message: 'Result processed',
      saved: false,
      error: 'Database temporarily unavailable',
    }, { status: 200 });
  }
}

// Optional: GET endpoint to retrieve user results
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter required' },
        { status: 400 }
      );
    }

    await connectDB();

    if (!isDBConnected()) {
      return NextResponse.json({
        results: [],
        message: 'Database not available',
      }, { status: 200 });
    }

    const results = await UserResult.find({ email })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({
      results,
      count: results.length,
    }, { status: 200 });

  } catch (error) {
    console.error('Error in GET /api/saveResult:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve results', results: [] },
      { status: 500 }
    );
  }
}
