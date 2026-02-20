require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Testing database connection...');
    try {
        await prisma.$connect();
        console.log('✅ Connection successful!');
        const users = await prisma.user.count();
        console.log(`✅ Database has ${users} users.`);
    } catch (e) {
        console.error('❌ Connection failed:', e.message);
        if (e.message.includes('does not exist')) {
            console.error('HINT: You probably need to run "npx prisma migrate dev --name init"');
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
