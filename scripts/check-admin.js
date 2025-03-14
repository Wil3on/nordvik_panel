// Script to check admin credentials in the database
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAdminUsers() {
  try {
    const adminUsers = await prisma.user.findMany({
      where: {
        role: 'ADMIN'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    
    console.log('Admin users found:');
    console.log(JSON.stringify(adminUsers, null, 2));
    
    return adminUsers;
  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getAdminUsers();
