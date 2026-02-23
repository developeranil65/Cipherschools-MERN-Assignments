
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

/**
 * Configures Passport with Google OAuth 2.0 strategy.
 * - On successful Google login, finds or creates a user in the database.
 * - Serializes user ID into the session.
 * - Deserializes user from the session by looking up the ID.
 *
 * @param {import('passport')} passport - The Passport instance to configure.
 */
module.exports = (passport) => {
    /* ---------- Google OAuth Strategy ---------- */
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "/auth/google/callback",
            },
            async (_accessToken, _refreshToken, profile, done) => {
                try {
                    // Check if the user already exists in our database
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        return done(null, user);
                    }

                    // Create a new user from the Google profile data
                    user = await User.create({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value,
                    });

                    return done(null, user);
                } catch (error) {
                    return done(error, null);
                }
            }
        )
    );


    /** Store only the user ID in the session to keep it lightweight. */
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    /** Retrieve the full user object from the database using the stored ID. */
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};
