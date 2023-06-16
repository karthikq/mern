const localStatergy = require("passport-local").Strategy;
const User = require("../models/User");

const localPassport = (passport) => {
  passport.use(
    new localStatergy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async function (email, password, cb) {
        try {
          const user = await User.findOne({ email, password })
            .select("-password")
            .populate("city");
          if (user) {
            return cb(null, user, { message: "User  found" });
          } else {
            return cb(null, false, { message: "User not found" });
          }
        } catch (error) {
          console.log("User not found", error);
        }
      }
    )
  );
};
module.exports = localPassport;
