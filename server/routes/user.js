const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const localPassport = require("../Stratergy/passport-local");
const route = express.Router();
const passport = require("passport");
const JWTlocalstratergy = require("../Stratergy/passport-jwt");
const Tokens = require("../models/Tokens");
const uniqId = require("uniqid");
const googleStrat = require("../Stratergy/passport-google");
const City = require("../models/city");

localPassport(passport);
JWTlocalstratergy(passport);
googleStrat(passport);

route.get(
  "/getuser",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user) {
      return res.status(200).json({ user: req.user });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  }
);
route.get("/aggregate", async (req, res) => {
  //getting list of users which are belonging to specify city

  User.aggregate([
    {
      $lookup: {
        from: "cities",
        localField: "city",
        foreignField: "_id",
        as: "city",
      },
    },
    { $unwind: "$city" },
    { $match: {} },
    {
      $group: { _id: "$city.name", user: { $push: "$username" } },
    },
  ])
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((error) => {
      console.log(error);
    });
});

route.post(
  "/login",
  passport.authenticate("local", { session: false }),
  async (req, res, next) => {
    const user = req.user;
    const jti = uniqId();
    jwt.sign(
      { email: user.email, jti },
      process.env.JWT_TOKEN,
      { expiresIn: "1hr" },
      (err, token) => {
        if (err) {
          console.log(err);
        }
        return res.status(200).json({ message: "user logged In", token, user });
      }
    );
  }
);

route.get(
  "/google/login",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  }),
  (req, res, next) => {}
);

route.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  }),
  (req, res, next) => {
    if (req.user) {
      const jti = uniqId();
      jwt.sign(
        { email: req.user.email, jti },
        process.env.JWT_TOKEN,
        { expiresIn: "1hr" },
        (err, token) => {
          return res.redirect("http://localhost:3000?token=" + token);
        }
      );
    }
  }
);
route.post("/register", async (req, res, next) => {
  const { email, password, username, city } = req.body;

  try {
    if (!email || !password) {
      const error = new Error("Email & Password is required");
      error.statusCode = 500;

      throw error;
    }

    const checkUserExists = await User.findOne({ email });
    if (checkUserExists) {
      const error = new Error("Email already exists");
      error.statusCode = 500;
      throw error;
    }

    const newCity = new City({
      name: city,
    });

    await newCity.save();

    const newUser = await new User({
      email,
      password,
      username,
      city: newCity._id,
    }).populate("city");

    const savedUser = await newUser.save();
    const userwithpass = savedUser.toObject();
    delete userwithpass.password;

    const jti = uniqId();

    jwt.sign({ email, jti }, process.env.JWT_TOKEN, (err, token) => {
      //we are going to pass JWT To frontend and store it there

      return res
        .status(200)
        .json({ message: "User registered", token, user: userwithpass });
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
});

route.post("/logout", async (req, res) => {
  //jwt is removed from frontend
  const bearerToken = req.headers["authorization"];

  if (bearerToken) {
    const token = bearerToken.split(" ")[1];

    const decode = jwt.decode(token);

    const newToken = new Tokens({
      jti: decode.jti,
    });
    await newToken.save();
    return res.json({ message: "User logged out" });
  }
});
module.exports = route;
