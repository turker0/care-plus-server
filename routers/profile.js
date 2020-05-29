const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Profile = require("../models/profile");

router.get("/", (req, res, next) => {
  Profile.find()
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
  const profile = new Profile({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    gender: req.body.gender,
    height: req.body.height,
    weight: req.body.weight,
    date: req.body.date,
  });
  profile
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Profile added successfully",
        addedProfile: result,
      });
    })
    .catch((err) => console.log(err));
});

router.get("/:profileId", (req, res, next) => {
  const id = req.params.profileId;
  Profile.findById(id)
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

router.delete("/:profileId", (req, res, next) => {
  const id = req.params.profileId;
  Profile.remove({ _id: id })
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
