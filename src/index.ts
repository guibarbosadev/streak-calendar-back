import express, { NextFunction, Request } from "express";
import session from "express-session";
import helmet from "helmet";
import {
  AUTH_SESSION_COOKIE_NAME,
  AUTH_SESSION_SECRET,
  DB_URI,
  GOOGLE_CLIENT_ID,
  PORT,
} from "./constants";
import { connectToDB } from "./db";
import { startSessionStore } from "./sessionStore";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { TypedRequestBody, TOAuthProvider } from "./types";
import { OAuth2Client } from "google-auth-library";
import { IUser, User } from "./schemas/User";
import { Challenge } from "./schemas/Challenge";

declare module "express-session" {
  interface SessionData {
    user: IUser;
  }
}

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
const app = express();
connectToDB(DB_URI);

app.use(express.json());
app.use(helmet());
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
});
app.use(
  session({
    secret: AUTH_SESSION_SECRET,
    name: AUTH_SESSION_COOKIE_NAME,
    resave: false,
    saveUninitialized: true,
    unset: "destroy",
    cookie: {
      maxAge: 300_000, // 5 minutes
    },
    store: startSessionStore(),
  })
);

app.get("/", ensureIsAuthenticated, (_req, res) => {
  res.send("and running");
});

app.get("/challenges", ensureIsAuthenticated, async (req, res) => {
  const { _id: userId } = req.session.user ?? {};

  const challenges = await Challenge.find({ userId });

  res.json(challenges);
});

app.post("/login", async (req: TypedRequestBody<{ idToken: string }>, res) => {
  const { idToken = "" } = req.body ?? {};

  if (idToken) {
    const ticket = await googleClient.verifyIdToken({ idToken });
    const googleId = ticket.getUserId() ?? "";

    const userDoc = await User.findOne({ googleId });
    const user: IUser = JSON.parse(JSON.stringify(userDoc?.toJSON()));

    if (user) {
      req.session.user = user;
      res.json(user);
      return;
    }
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => undefined);
  res.status(StatusCodes.OK).send();
});

function ensureIsAuthenticated(
  req: Request,
  res: express.Response,
  next: NextFunction
) {
  if (req.session.user) {
    return next();
  } else {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: ReasonPhrases.UNAUTHORIZED });
  }
}

app.listen(PORT, async () => {
  if (!DB_URI) {
    console.log('Environment variable "DB_URI" is required.');
    process.exit();
  }

  console.log(`Listening on port ${PORT}`);
});
