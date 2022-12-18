import express, { NextFunction, Request, Response } from "express";
import {
  AUTH_SESSION_COOKIE_NAME,
  AUTH_SESSION_SECRET,
  DB_NAME,
  DB_URI,
  PORT,
} from "./constants";
import helmet from "helmet";
import { connectToDB } from "./db";
import { activateGoogleStrategy } from "./passport";
import passport from "passport";
import session from "express-session";
import { startSessionStore } from "./sessionStore";

const app = express();
connectToDB(DB_URI);
activateGoogleStrategy();

app.use(express.json());
app.use(helmet());
app.use(
  session({
    secret: AUTH_SESSION_SECRET,
    name: AUTH_SESSION_COOKIE_NAME,
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
    cookie: {
      httpOnly: false,
      maxAge: 300_000, // 5 minutes
    },
    store: startSessionStore(),
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

function ensureIsAuthenticated(
  req: Request,
  res: express.Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
}

app.get("/profile", ensureIsAuthenticated, (req, res, next) => {
  res.json({ user: req.user });
});

app.listen(PORT, async () => {
  if (!DB_URI) {
    console.log('Environment variable "DB_URI" is required.');
    process.exit();
  }

  console.log(`Listening on port ${PORT}`);
});
