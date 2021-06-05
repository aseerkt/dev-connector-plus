import 'colors';
import 'dotenv/config';
import argon2 from 'argon2';
import { mongoose } from '@typegoose/typegoose';
import { connectDB } from '../config/db';
import { ProfileModel } from '../entities/Profile';
import { UserModel } from '../entities/User';
import profileData from './profileData';
import userData from './userData';
import { PostModel } from '../entities/Post';
import postData from './postData';

const argv = process.argv;

if (argv[2] !== '-p') {
  console.log("\nNeed to provide password with '-p' flag \n".red);
  process.exit(1);
} else if (!argv[3]) {
  console.log("\nPassword not given along with '-p' flag \n".red);
  process.exit(1);
}

const password = process.argv[3];

const hashingUserPwd = userData.map(async (u) => {
  const hashedPassword = await argon2.hash(password);
  return { ...u, password: hashedPassword };
});

async function main() {
  await connectDB();

  await mongoose.connection.db.dropDatabase();

  // Create users
  const userDataWithPwd = await Promise.all(hashingUserPwd);

  const users = await UserModel.insertMany(userDataWithPwd);

  // Create profiles

  const profileDataWithUser = profileData.map((p, i) => ({
    ...p,
    user: users[i]._id,
  }));

  await ProfileModel.insertMany(profileDataWithUser);

  await PostModel.insertMany(
    postData.map((p) => ({ ...p, user: users[2]._id }))
  );

  console.log('Seeding database done'.yellow.bold);
  process.exit(0);
}

main().catch((err) => {
  console.error(`Something went wrong: ${err.message}`.red.bold);
  process.exit(1);
});
