import express from "express";
import { DB_URI, PORT } from "./constants";
import helmet from "helmet";
import { connectToCluster } from "./db";

const app = express();

app.use(express.json());
app.use(helmet());

app.get("/", (_req, res) => {
  res.json({ up: "and running" });
});

app.get("/users", async (_req, res) => {
  const dbConnection = await connectToCluster(DB_URI!);
  const database = dbConnection.db("calendar");
  const usersCollection = database.collection("users");
  const users = await usersCollection.find().toArray();

  res.json(users);
  dbConnection.close();
});

app.listen(PORT, async () => {
  if (!DB_URI) {
    console.log('Environment variable "DB_URI" is required.');
    process.exit();
  }

  console.log(`Listening on port ${PORT}`);
});
