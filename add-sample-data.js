// In your add-sample-data.js and other files
import { Animal, Shelter } from './src/models/index.js';
import sequelize from './src/db.js';
import bcrypt from 'bcrypt';
import User from './src/models/User.js';

const addSampleData = async () => {
  try {
    // Force sync to ensure clean slate
    await sequelize.sync({ force: true });
    console.log('Database synced!');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    const regularUser = await User.create({
      username: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('user123', 10),
      role: 'user'
    });

    // Create shelters
    const shelters = await Shelter.bulkCreate([
      { name: 'Maple Shelter', contact_info: 'mapleshelter@example.com', address: '101 Maple' },
      { name: 'Oak Shelter', contact_info: 'oakshelter@example.com', address: '202 Oak' },
      { name: 'Pine Shelter', contact_info: 'pineshelter@example.com', address: '303 Pine' },
      { name: 'Cedar Shelter', contact_info: 'cedarshelter@example.com', address: '404 Cedar' },
      { name: 'Birch Shelter', contact_info: 'birchshelter@example.com', address: '505 Birch Lane' },
    ]);
    console.log(`Created ${shelters.length} shelters`);

    // Create animals with explicit shelterId
    const animals = await Animal.bulkCreate([
      // Shelter 1 (Maple Shelter)
      {
        name: 'Buddy', age: 3, species: 'Dog', breed: 'Labrador', color: 'Golden',
        description: 'Friendly and playful. Loves fetch and swimming.', 
        shelterId: shelters[0].id,
        photo: 'https://images.unsplash.com/photo-1529831129093-0fa4866281ee?q=80',
      },
      {
        name: 'Mittens', age: 2, species: 'Cat', breed: 'Domestic Shorthair', color: 'Tabby',
        description: 'Gentle and affectionate. Enjoys sunny spots.', 
        shelterId: shelters[0].id,
        photo: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80',
      },
      {
        name: 'Rex', age: 5, species: 'Dog', breed: 'German Shepherd', color: 'Black/Tan',
        description: 'Loyal and protective. Great with older children.', 
        shelterId: shelters[0].id,
        photo: 'https://images.unsplash.com/photo-1605725657590-b2cf0d31b1a5?q=80',
      },
    
      // Shelter 2 (Oak Shelter)
      {
        name: 'Luna', age: 1, species: 'Cat', breed: 'Siamese', color: 'Cream',
        description: 'Playful and vocal. Loves attention.', 
        shelterId: shelters[1].id,
        photo: 'https://images.unsplash.com/photo-1568152950566-c1bf43f4ab28?q=80',
      },
      {
        name: 'Rocky', age: 4, species: 'Dog', breed: 'Bulldog', color: 'Brindle',
        description: 'Easygoing and friendly. Great apartment dog.', 
        shelterId: shelters[1].id,
        photo: 'https://images.unsplash.com/photo-1611611158876-41699b77a059?q=80',
      },
      {
        name: 'Coco', age: 2, species: 'Bird', breed: 'Cockatiel', color: 'Gray/Yellow',
        description: 'Whistles beautifully. Hand-raised and tame.', 
        shelterId: shelters[1].id,
        photo: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?q=80',
      },
    
      // Shelter 3 (Pine Shelter)
      {
        name: 'Bella', age: 3, species: 'Dog', breed: 'Golden Retriever', color: 'Golden',
        description: 'Energetic and loving. Great family pet.', 
        shelterId: shelters[2].id,
        photo: 'https://images.unsplash.com/photo-1612774412771-005ed8e861d2?q=80',
      },
      {
        name: 'Oliver', age: 1, species: 'Cat', breed: 'Maine Coon', color: 'Brown Tabby',
        description: 'Fluffy and gentle. Gets along with other cats.', 
        shelterId: shelters[2].id,
        photo: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80',
      },
      {
        name: 'Thumper', age: 2, species: 'Rabbit', breed: 'Holland Lop', color: 'White',
        description: 'Sweet and curious. Litter box trained.', 
        shelterId: shelters[2].id,
        photo: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?q=80',
      },
    
      // Shelter 4 (Cedar Shelter)
      {
        name: 'Max', age: 2, species: 'Dog', breed: 'Beagle', color: 'Tri-color',
        description: 'Friendly and curious. Loves sniffing everything.', 
        shelterId: shelters[3].id,
        photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80',
      },
      {
        name: 'Chloe', age: 4, species: 'Cat', breed: 'Persian', color: 'White',
        description: 'Calm and regal. Needs regular grooming.', 
        shelterId: shelters[3].id,
        photo: 'https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?q=80',
      },
      {
        name: 'Spike', age: 3, species: 'Reptile', breed: 'Bearded Dragon', color: 'Tan',
        description: 'Docile and easy to care for. Enjoys basking.', 
        shelterId: shelters[3].id,
        photo: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?q=80',
      },
    
      // Shelter 5 (Birch Shelter)
      {
        name: 'Daisy', age: 1, species: 'Dog', breed: 'Dachshund', color: 'Red',
        description: 'Playful and clever. Loves burrowing in blankets.', 
        shelterId: shelters[4].id,
        photo: 'https://images.unsplash.com/photo-1517423568366-8b83523034fd?q=80',
      },
      {
        name: 'Simba', age: 2, species: 'Cat', breed: 'Orange Tabby', color: 'Orange',
        description: 'Confident and friendly. Loves climbing.', 
        shelterId: shelters[4].id,
        photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80',
      },
      {
        name: 'Pepper', age: 1, species: 'Dog', breed: 'Poodle Mix', color: 'Black',
        description: 'Smart and energetic. Needs regular grooming.', 
        shelterId: shelters[4].id,
        photo: 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?q=80',
      }
    ]);
    console.log(`Created ${animals.length} animals`);

    console.log('✅ Sample data inserted successfully!');
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
  } finally {
    process.exit();
  }
};

addSampleData();