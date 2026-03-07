const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Validate profile data
        if (!profile || !profile.id) {
          return done(new Error("Invalid Google profile"), null);
        }
        if (!profile.emails || profile.emails.length === 0) {
          return done(new Error("Google account has no email"), null);
        }
        if (!profile.name) {
          return done(new Error("Google account has no name"), null);
        }

        // Check if user exists
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Create new user safely
          user = await User.create({
            firstName: profile.name.givenName || "Unknown",
            lastName: profile.name.familyName || "User",
            email: profile.emails[0].value,
            googleId: profile.id,
            role: "user",
          });
        }

        return done(null, user);
      } catch (err) {
        console.error("Google OAuth error:", err);
        return done(err, null);
      }
    }
  )
);

// Serialize user into session
passport.serializeUser((user, done) => done(null, user.id));

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});