import connectDb from '@/lib/db';
import User from '@/model/user.model';
import bcrypt from 'bcryptjs';

async function createTestUsers() {
  try {
    console.log('Connecting to database...');
    await connectDb();
    
    // Create admin user
    const adminEmail = 'admin@bookworm.com';
    const adminPassword = 'Admin@123';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const adminHash = await bcrypt.hash(adminPassword, 10);
      const adminUser = await User.create({
        name: 'Admin User',
        email: adminEmail,
        password: adminHash,
        role: 'admin',
        image: ''
      });
      
      console.log('Admin user created successfully:', adminUser.email);
    } else {
      console.log('Admin user already exists:', existingAdmin.email);
    }
    
    // Create regular user
    const userEmail = 'user@bookworm.com';
    const userPassword = 'User@123';
    
    const existingUser = await User.findOne({ email: userEmail });
    
    if (!existingUser) {
      const userHash = await bcrypt.hash(userPassword, 10);
      const regularUser = await User.create({
        name: 'Regular User',
        email: userEmail,
        password: userHash,
        role: 'user',
        image: ''
      });
      
      console.log('Regular user created successfully:', regularUser.email);
    } else {
      console.log('Regular user already exists:', existingUser.email);
    }
    
    console.log('Test users setup completed!');
  } catch (error) {
    console.error('Error creating test users:', error);
  }
}

createTestUsers();