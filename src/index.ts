import express from "express";
import { PORT } from "./constants";
import helmet from "helmet";

const app = express();

app.use(express.json());
app.use(helmet());

app.get("*", (_request, response) => {
  response.json({ up: "and running" });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
