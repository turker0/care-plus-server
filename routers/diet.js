const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Diet = require("../models/diet");

router.get("/", (req, res, next) => {
  Diet.find()
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
  const diet = new Diet({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    totalCalorie: req.body.calorie,
    breakfast: req.body.breakfast,
    lunch: req.body.lunch,
    dinner: req.body.foodList,
  });
  diet
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Diet added successfully",
        addedDiet: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/:dietId", (req, res, next) => {
  const id = req.params.dietId;
  Diet.findById(id)
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete("/:dietId", (req, res, next) => {
  const id = req.params.dietId;
  Diet.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
