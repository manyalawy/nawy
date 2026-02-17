import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@nawy.com' },
    update: {},
    create: {
      email: 'admin@nawy.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create regular user
  const user = await prisma.user.upsert({
    where: { email: 'user@nawy.com' },
    update: {},
    create: {
      email: 'user@nawy.com',
      password: hashedPassword,
      name: 'Test User',
      role: 'USER',
    },
  });

  console.log('Seed users created successfully!');
  console.log('Admin:', admin.email);
  console.log('User:', user.email);
  console.log('Password for both: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
