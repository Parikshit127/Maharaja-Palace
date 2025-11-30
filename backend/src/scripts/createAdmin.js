import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';

dotenv.config();

const createAdmin = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Define User schema inline to avoid import issues
        const userSchema = new mongoose.Schema({
            firstName: String,
            lastName: String,
            email: String,
            phone: String,
            password: String,
            role: String,
            isActive: Boolean,
            isEmailVerified: Boolean,
            lastLogin: Date,
        }, { timestamps: true });

        const User = mongoose.models.User || mongoose.model('User', userSchema);

        const adminEmail = 'admin@maharajapalace.com';
        const adminPassword = 'admin123';

        // Delete existing admin if exists
        await User.deleteOne({ email: adminEmail });
        console.log('🗑️  Removed old admin user (if existed)');

        // Hash password manually
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(adminPassword, salt);

        // Create new admin
        const adminUser = await User.create({
            firstName: 'Admin',
            lastName: 'Palace',
            email: adminEmail,
            phone: '9999999999',
            password: hashedPassword,
            role: 'admin',
            isActive: true,
            isEmailVerified: true,
            lastLogin: null,
        });

        console.log('\n✅ Admin user created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:', adminEmail);
        console.log('🔑 Password:', adminPassword);
        console.log('👤 Role:', adminUser.role);
        console.log('🆔 ID:', adminUser._id);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n🚀 You can now login at: http://localhost:5173/login');
        console.log('🎯 Admin panel: http://localhost:5173/admin\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        console.error(error);
        process.exit(1);
    }
};

createAdmin();
