import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import User from '@/model/user.model';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDb();
    
    // Check if test users exist
    const adminUser = await User.findOne({ email: 'admin@bookworm.com' });
    const regularUser = await User.findOne({ email: 'user@bookworm.com' });
    
    const envVars = {
      hasMONGODB_URI: !!process.env.MONGODB_URI || !!process.env.MONGODB_URL,
      hasNEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      mongodbUriExists: !!process.env.MONGODB_URI,
      mongodbUrlExists: !!process.env.MONGODB_URL,
    };
    
    return NextResponse.json({
      status: 'OK',
      databaseConnected: true,
      testUsers: {
        adminExists: !!adminUser,
        userExists: !!regularUser,
      },
      environment: envVars,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Debug auth error:', error);
    return NextResponse.json(
      { 
        status: 'ERROR', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDb();
    
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    console.log('Debug login attempt for:', email);
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }
    
    console.log('User found:', user.name);
    console.log('Stored password hash:', user.password ? 'Exists' : 'Missing');
    console.log('Input password length:', password.length);
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Debug login error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}