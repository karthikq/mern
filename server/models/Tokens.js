const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  jti: String,
});

const Token = mongoose.model("Token", TokenSchema);

module.exports = Token;
