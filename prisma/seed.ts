import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      email: 'szabo.roland.1213@gmail.com',
      username: 'admin',
      password: '$2a$12$fd3JI/7kRGxY/2yddYHuLuBn86hO6HuGfEQTPrgMYp/X2rei8Xhau',
      role: 'ADMIN',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
