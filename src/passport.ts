import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "./constants";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { User } from "./schemas/User";

export function activateGoogleStrategy() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/google/callback",
        passReqToCallback: true,
      },
      async (_request, _accessToken, _refreshToken, { id: googleId }, done) => {
        try {
          const user = await User.findOrCreate(googleId);
          done(null, user);
        } catch (error: any) {
          done(error);
        }
      }
    )
  );
  passport.serializeUser((user: { _id?: string }, done) => {
    process.nextTick(() => done(null, user?._id));
  });

  passport.deserializeUser((id: string, done) => {
    process.nextTick(() => {
      User.findById(id, (err: any, user: typeof User) => {
        if (!err) done(null, user);
        else done(err, null);
      });
    });
  });
}
