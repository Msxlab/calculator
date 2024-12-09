const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log('Starting database seed...');

  try {
    // Clear existing users
    await prisma.user.deleteMany();
    console.log('Cleared existing users');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'admin',
      },
    });

    console.log('Admin user created successfully:', adminUser);
    return { success: true, user: adminUser };

  } catch (error) {
    console.error('Error during seeding:', error);
    return { success: false, error };
  }
}

seedDatabase()
  .then((result) => {
    console.log('Seed result:', result);
    process.exit(result.success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });