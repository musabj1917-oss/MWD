import { db } from '../src/db/index';
import { users } from '../src/db/schema';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
        console.error("Usage: npx tsx scripts/create-admin.ts <email> <password>");
        process.exit(1);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    try {
        await db.insert(users).values({
            email,
            name: 'Admin',
            passwordHash,
            role: 'admin'
        });
        console.log(`Admin user ${email} created successfully.`);
    } catch (e) {
        console.error("Failed to create admin:", e);
    }
    process.exit(0);
}

main();
