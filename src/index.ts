import express from "express";
import { DB_NAME, DB_URI, PORT } from "./constants";
import helmet from "helmet";
import { connectToDB } from "./db";
import { activateGoogleStrategy } from "./passport";
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongo";

const app = express();
activateGoogleStrategy();

app.use(express.json());
app.use(helmet());
app.use(
  session({
    secret: "keyboard cat",
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (_req, res) => {
  res.send("and running");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { scope: ["email", "profile"] }),
  (req, res) => {
    res.redirect("/profile");
  }
);

app.get("/profile", (req, res) => {
  const { isAuthenticated } = req;
  console.log({ isAuthenticated: isAuthenticated() });
  res.send("Hello, you are authenticated");
});

app.listen(PORT, async () => {
  if (!DB_URI) {
    console.log('Environment variable "DB_URI" is required.');
    process.exit();
  }

  console.log(`Listening on port ${PORT}`);
});
