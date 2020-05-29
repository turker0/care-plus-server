const mongoose = require("mongoose");

const Food = mongoose.Schema({
  name: String,
  number: Number,
  numberDesc: String,
  calorie: Number,
});

const dietSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  breakfast: {
    type: [Food],
    required: true,
  },
  lunch: {
    type: [Food],
    required: true,
  },
  dinner: {
    type: [Food],
    required: true,
  },
  breakfastCalorie: {
    type: Number,
    required: true,
  },
  lunchCalorie: {
    type: Number,
    required: true,
  },
  dinnerCalorie: {
    type: Number,
    required: true,
  },
  totalCalorie: Number,
});

module.exports = mongoose.model("Diet", dietSchema);
