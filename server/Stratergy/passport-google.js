const passport = require("passport");
const User = require("../models/User");

const googleStragtergy = require("passport-google-oauth20").Strategy;

module.exports = (passport) => {
  const backendUrl =
    process.env.NODE_ENV === "production"
      ? ""
      : "http://localhost:5000/google/callback";
  passport.use(
    new googleStragtergy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: backendUrl,
      },
      async function (accessToken, refreshToken, profile, cb) {
        const username = profile.displayName;
        const email = profile.emails[0].value;
        const checkUser = await User.findOne({ email })
          .select("-password")
          .populate("city");
        if (checkUser) {
          return cb(null, checkUser, "user exists");
        } else {
          const newGoogleUser = await new User({
            username,
            email,
          });
          await newGoogleUser.save();
          return cb(null, newGoogleUser, "user logged In");
        }
      }
    )
  );
};
