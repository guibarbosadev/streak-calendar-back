import express from "express";
import { AUTH_COOKIE_NAME, DB_NAME, DB_URI, PORT } from "./constants";
import helmet from "helmet";
import { connectToDB } from "./db";
import { activateGoogleStrategy } from "./passport";
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongo";

const app = express();
connectToDB(DB_URI);
activateGoogleStrategy();

app.use(express.json());
app.use(helmet());
app.use(
  session({
    secret: "keyboard cat",
    name: AUTH_COOKIE_NAME,
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
    cookie: {
      httpOnly: false,
      maxAge: 300_000, // 5 minutes
    },
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
  passport.authenticate("google", {
    scope: ["email", "profile"],
    successRedirect: "/profile",
    failureRedirect: "/auth/error",
  })
);

app.get("/auth/error", (req, res) => {
  res.json({ message: "Authentication failed", user: req.user });
});

app.get("/profile", (req, res) => {
  const { user } = req;

  if (user) {
    res.json({ profile: user });
  } else {
    res.send("Oopss... you are not authenticated");
  }
});

app.listen(PORT, async () => {
  if (!DB_URI) {
    console.log('Environment variable "DB_URI" is required.');
    process.exit();
  }

  console.log(`Listening on port ${PORT}`);
});
