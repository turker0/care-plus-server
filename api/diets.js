const express = require("express");
const router = express.Router();

const Diet = require("../models/diet");

router.post("/add", (req, res) => {
  Diet.findOne({ name: req.body.name }).then((diet) => {
    if (diet) {
      return res.status(400).json({ mail: "Diet already exists" });
    } else {
      let breakfastCalorie = 0,
        lunchCalorie = 0,
        dinnerCalorie = 0;

      for (let food in req.body.breakfast) {
        breakfastCalorie += req.body.breakfast[food].calorie;
      }

      for (let food in req.body.lunch) {
        lunchCalorie += req.body.lunch[food].calorie;
      }

      for (let food in req.body.dinner) {
        dinnerCalorie += req.body.dinner[food].calorie;
      }

      const newDiet = new Diet({
        name: req.body.name,
        breakfast: req.body.breakfast,
        lunch: req.body.lunch,
        dinner: req.body.dinner,
        breakfastCalorie: breakfastCalorie,
        lunchCalorie: lunchCalorie,
        dinnerCalorie: dinnerCalorie,
        totalCalorie: breakfastCalorie + lunchCalorie + dinnerCalorie,
      });

      newDiet
        .save()
        .then((diet) => res.json(diet))
        .catch((err) => console.log(err));
    }
  });
});

router.get("/:name", (req, res, next) => {
  const name = req.params.name;
  Diet.findOne({ name })
    .exec()
    .then((result) => {
      console.log("From database", result);
      if (result) {
        res.status(200).json(result);
      } else {
        res
          .status(404)
          .json({ error: "No valid entry found for provieded ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/get/All", (req, res, next) => {
  Diet.find({}, (err, diets) => {
    var dietMap = [];
    diets.forEach((diet, index) => {
      dietMap[index] = diet;
    });
    res.status(200).json(dietMap);
  })
    .exec()
    .then()
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
