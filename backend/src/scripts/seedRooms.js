import mongoose from 'mongoose';
import RoomType from '../models/RoomType.js';
import Room from '../models/Room.js';
import { config } from '../config/env.js';

const seedRooms = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await RoomType.deleteMany({});
    await Room.deleteMany({});
    console.log('🗑️  Cleared existing rooms and room types');

    // Create Room Types
    const roomTypes = [
      {
        name: 'KHWABGAH (Penthouse)',
        description: 'Khwabgah is a spacious royal chamber encompassing 2 bedrooms, a living room, a dining room, a separate bar, a private butler service and an office chamber with a private terrace.',
        amenities: ['2 Bedrooms', 'Living Room', 'Dining Room', 'Private Bar', 'Butler Service', 'Office Chamber', 'Private Terrace', 'King Size Bed', 'Luxury Bathroom', 'WiFi', 'Smart TV', 'Mini Bar', 'Coffee Maker', 'Air Conditioning'],
        basePrice: 25000,
        maxOccupancy: 4,
        squareFeet: 2500,
        features: ['Penthouse', 'Butler Service', 'Private Terrace'],
        images: [
          { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200', alt: 'Khwabgah 1' },
          { url: 'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=1200', alt: 'Khwabgah 2' },
          { url: 'https://images.unsplash.com/photo-1631049552240-59c37f563fd5?w=1200', alt: 'Khwabgah 3' },
        ],
      },
      {
        name: 'PRESIDENTIAL SUITE',
        description: 'Bedecked with demure interiors and soft lights, this suite is an epitome of effortless luxury coupled with immaculate services for bespoke experiences.',
        amenities: ['1 Bedroom', 'Living Area', 'King Size Bed', 'Luxury Bathroom', 'WiFi', 'Smart TV', 'Mini Bar', 'Coffee Maker', 'Air Conditioning', 'Room Service', 'Concierge'],
        basePrice: 18000,
        maxOccupancy: 3,
        squareFeet: 1800,
        features: ['Suite', 'Concierge Service'],
        images: [
          { url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200', alt: 'Presidential 1' },
          { url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200', alt: 'Presidential 2' },
          { url: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200', alt: 'Presidential 3' },
        ],
      },
      {
        name: 'HERITAGE SUITES',
        description: 'These graceful suites offer the best of both worlds – luxury and comfort. Opulently furnished with modern comforts and Indian art forms.',
        amenities: ['1 Bedroom', 'King Size Bed', 'Luxury Bathroom', 'WiFi', 'Smart TV', 'Mini Bar', 'Coffee Maker', 'Air Conditioning', 'Room Service'],
        basePrice: 12000,
        maxOccupancy: 2,
        squareFeet: 1200,
        features: ['Suite', 'Heritage Design'],
        images: [
          { url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200', alt: 'Heritage 1' },
          { url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200', alt: 'Heritage 2' },
          { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200', alt: 'Heritage 3' },
        ],
      },
      {
        name: 'CLUB ROYAL ROOMS',
        description: 'Well appointed rooms adorned by vibrant upholstery representing rich royal history with modern amenities for a luxurious stay.',
        amenities: ['1 Bedroom', 'Queen Size Bed', 'Bathroom', 'WiFi', 'TV', 'Mini Bar', 'Air Conditioning', 'Room Service'],
        basePrice: 8000,
        maxOccupancy: 2,
        squareFeet: 800,
        features: ['Royal Design', 'Club Access'],
        images: [
          { url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200', alt: 'Club Royal 1' },
          { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200', alt: 'Club Royal 2' },
          { url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200', alt: 'Club Royal 3' },
        ],
      },
      {
        name: 'CLUB ROOMS',
        description: 'Beautifully bedecked with aesthetically pleasing interiors, offering beautiful views and authentic royal experience.',
        amenities: ['1 Bedroom', 'Queen Size Bed', 'Bathroom', 'WiFi', 'TV', 'Air Conditioning', 'Room Service'],
        basePrice: 6000,
        maxOccupancy: 2,
        squareFeet: 600,
        features: ['Comfortable', 'Club Access'],
        images: [
          { url: 'https://images.unsplash.com/photo-1631049035182-249067d7618e?w=1200', alt: 'Club 1' },
          { url: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200', alt: 'Club 2' },
          { url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200', alt: 'Club 3' },
        ],
      },
    ];

    const createdRoomTypes = await RoomType.insertMany(roomTypes);
    console.log('✅ Created room types:', createdRoomTypes.length);

    // Create Rooms for each type
    const rooms = [];
    createdRoomTypes.forEach((roomType, index) => {
      const numRooms = index === 0 ? 2 : index === 1 ? 3 : 5; // Penthouse: 2, Presidential: 3, Others: 5
      for (let i = 1; i <= numRooms; i++) {
        rooms.push({
          roomNumber: `${index + 1}0${i}`,
          roomType: roomType._id,
          floor: index + 1,
          status: 'available',
          currentPrice: roomType.basePrice,
          images: roomType.images,
          isActive: true,
        });
      }
    });

    const createdRooms = await Room.insertMany(rooms);
    console.log('✅ Created rooms:', createdRooms.length);

    console.log('\n📋 Room Types and IDs:');
    createdRoomTypes.forEach((rt) => {
      console.log(`  ${rt.name}: ${rt._id}`);
    });

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedRooms();
