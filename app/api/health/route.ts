import { NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Attempt to connect to MongoDB
    await connectDB();

    const dbConnected = isDBConnected();
    const dbStatus = dbConnected ? 'connected' : 'disconnected';

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus,
        connected: dbConnected,
        type: process.env.MONGODB_URI ? 'MongoDB' : 'Mock Data',
        readyState: mongoose.connection.readyState,
        readyStateText: getReadyStateText(mongoose.connection.readyState),
        host: dbConnected ? mongoose.connection.host : 'N/A',
        name: dbConnected ? mongoose.connection.name : 'N/A',
      },
      api: {
        analyze: 'operational',
        remediate: 'operational',
        saveResult: dbConnected ? 'operational' : 'degraded (using mock data)',
      },
    };

    return NextResponse.json(health, { status: 200 });
  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        database: {
          status: 'error',
          connected: false,
          type: process.env.MONGODB_URI ? 'MongoDB' : 'Mock Data',
        },
      },
      { status: 503 }
    );
  }
}

function getReadyStateText(state: number): string {
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[state] || 'unknown';
}
