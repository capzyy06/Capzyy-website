import dotenv from 'dotenv';
import mongoose from 'mongoose';

import Category from './src/models/Category.js';
import Product from './src/models/Product.js';
import User from './src/models/User.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  console.log('Connected. Seeding...');

  await User.create({
    name: 'Capzyy Admin',
    email: 'capzyy06@gmail.com',
    password: 'capzyy@1234',
    role: 'admin',
  });

  console.log('✅ Admin: capzyy06@gmail.com / capzyy@1234');

  await mongoose.disconnect();

  console.log('🎉 Seeding complete!');
};

seed().catch(console.error);