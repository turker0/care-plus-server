const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const key = require("../config/keys");

const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const Profile = require("../models/profile");

router.post("/register", (req, res) => {
  //Form validation

  const { errors, isValid } = validateRegisterInput(req.body);
  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Profile.findOne({ mail: req.body.mail }).then((profile) => {
    if (profile) {
      return res.status(400).json({ mail: "mail already exists" });
    } else {
      const newProfile = new Profile({
        name: req.body.name,
        mail: req.body.mail,
        password: req.body.password,
        age: req.body.age,
        gender: req.body.gender,
        height: req.body.height,
        weight: req.body.weight,
        bmi: req.body.bmi,
        bmr: req.body.bmr,
        target: req.body.target,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newProfile.password, salt, (err, hash) => {
          if (err) throw err;
          newProfile.password = hash;
          newProfile
            .save()
            .then((profile) => res.json(profile))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  // From Validation

  const { errors, isValid } = validateLoginInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const mail = req.body.mail;
  const password = req.body.password;

  //Find profile by mail
  Profile.findOne({ mail }).then((profile) => {
    //Check if profile exists
    if (!profile) {
      return res.status(404).json({ mailNotFound: "mail not found" });
    }

    //Check password
    bcrypt.compare(password, profile.password).then((isMatch) => {
      if (isMatch) {
        //Profile matched
        //Create JWT Payload
        const payload = {
          id: profile.id,
          name: profile.name,
        };

        jwt.sign(
          payload,
          key.secretOrKey,
          {
            expiresIn: 31556926, // 1 year
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer" + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

router.get("/:mail", (req, res, next) => {
  const mail = req.params.mail;
  Profile.findOne({ mail })
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

module.exports = router;
