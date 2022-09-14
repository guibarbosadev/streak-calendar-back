import express from "express";
import { PORT } from "./constants";

const app = express();

app.use(express.json());
app.get("*", (_request, response) => {
  response.json({ up: "and running" });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
