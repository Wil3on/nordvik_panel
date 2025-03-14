// Script to check for admin credentials or create a default admin
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// Default admin credentials
const DEFAULT_ADMIN = {
  name: 'Administrator',
  email: 'admin@nordvik.com',
  password: 'NordvikAdmin123',
  role: 'ADMIN'
};

async function checkAdminAccount() {
  try {
    // Check if any admin account exists
    const adminCount = await prisma.user.count({
      where: {
        role: 'ADMIN'
      }
    });
    
    console.log(`Found ${adminCount} admin accounts.`);
    
    if (adminCount > 0) {
      // List all admin accounts
      const admins = await prisma.user.findMany({
        where: {
          role: 'ADMIN'
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      });
      
      console.log('\nAdmin accounts:');
      admins.forEach(admin => {
        console.log(`- ${admin.name} (${admin.email})`);
      });
      
      return admins;
    } else {
      console.log('No admin accounts found. Creating default admin...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
      
      // Create default admin account
      const newAdmin = await prisma.user.create({
        data: {
          name: DEFAULT_ADMIN.name,
          email: DEFAULT_ADMIN.email,
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      
      console.log(`\nDefault admin account created successfully!`);
      console.log(`Email: ${DEFAULT_ADMIN.email}`);
      console.log(`Password: ${DEFAULT_ADMIN.password}`);
      
      return newAdmin;
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminAccount();
