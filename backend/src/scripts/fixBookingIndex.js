import mongoose from 'mongoose';
import { config } from '../config/env.js';

const fixBookingIndex = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('bookings');

    // Get all indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(i => i.name));

    // Drop the problematic bookingId index if it exists
    try {
      await collection.dropIndex('bookingId_1');
      console.log('✅ Dropped bookingId_1 index');
    } catch (error) {
      console.log('ℹ️  bookingId_1 index does not exist or already dropped');
    }

    console.log('\n✅ Index fix completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing index:', error);
    process.exit(1);
  }
};

fixBookingIndex();
