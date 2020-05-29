const mongoose = require("mongoose");

const foodSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  calorie: Number,
});

module.exports = mongoose.model("Food", foodSchema);
