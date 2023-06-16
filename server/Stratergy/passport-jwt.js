const { ExtractJwt } = require("passport-jwt");
const User = require("../models/User");
const Token = require("../models/Tokens");

const JWTStratergy = require("passport-jwt").Strategy;

const JWTlocalstratergy = (passport) => {
  passport.use(
    new JWTStratergy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_TOKEN,
      },
      async function (jwt_payload, cb) {
        //checking token if its blackisted
        const checkTokenBlacklist = await Token.findOne({
          jti: jwt_payload.jti,
        });
        if (checkTokenBlacklist) {
          return cb(null, false, "User not Authorized");
        } else {
          const user = await User.findOne({ email: jwt_payload.email })
            .select("-password")
            .populate("city");

          if (user) {
            return cb(null, user, "user authorized");
          } else {
            return cb(null, false, "user not authorized");
          }
        }
      }
    )
  );
};
module.exports = JWTlocalstratergy;
