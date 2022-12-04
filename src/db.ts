import { MongoClient } from "mongodb";
import mongoose from "mongoose";

function handleError() {
  const ERROR_MESSAGE = "Could not connect to database 😕";

  console.log(ERROR_MESSAGE);
  process.exit();
}

export function connectToDB(URI: string) {
  try {
    const { connection: db } = mongoose;

    db.on("error", handleError);
    mongoose.connect(URI);
  } catch (error) {
    process.exit();
  }
}
