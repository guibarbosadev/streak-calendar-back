import { MongoClient } from "mongodb";

export async function connectToCluster(URI: string) {
  try {
    const mongoClient = new MongoClient(URI);

    await mongoClient.connect();

    return mongoClient;
  } catch (error) {
    console.log("Could not connect to database 😕");

    process.exit();
  }
}
