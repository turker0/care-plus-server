const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Food = require("../models/food");

router.get("/", (req, res, next) => {
  Food.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  const food = new Food({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    calorie: req.body.calorie,
  });
  food
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Food added successfully",
        addedFood: result,
      });
    })
    .catch((err) => console.log(err));
});

router.get("/:foodId", (req, res, next) => {
  const id = req.params.foodId;
  Food.findById(id)
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provieded ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:foodId", (req, res, next) => {
  const id = req.params.foodId;
  Food.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
