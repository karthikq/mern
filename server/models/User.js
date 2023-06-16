const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      select: false,
    },
    username: String,
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
