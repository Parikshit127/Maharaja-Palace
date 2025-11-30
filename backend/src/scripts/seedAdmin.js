import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = 'admin@maharajapalace.com';
        const adminPassword = 'admin123';

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin user already exists');
            console.log(`Email: ${adminEmail}`);
            console.log('Password: (already set)');
        } else {
            const adminUser = await User.create({
                firstName: 'Admin',
                lastName: 'User',
                email: adminEmail,
                phone: '9999999999',
                password: adminPassword,
                role: 'admin',
                isActive: true,
                isEmailVerified: true,
            });

            console.log('Admin user created successfully');
            console.log(`Email: ${adminEmail}`);
            console.log(`Password: ${adminPassword}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
