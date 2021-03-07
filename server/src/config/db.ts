import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log(`Connected to MongoDB: ${conn.connection.host}`.yellow.bold);
  } catch (err) {
    console.log(`DB Connection Failed: ${err.message}`.red.bold);
    process.exit(1);
  }
};
