const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema({
  id: Number,
  name: String,
});

const City = mongoose.model("City", CitySchema);

module.exports = City;
