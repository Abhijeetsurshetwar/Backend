const express = require("express");
const router = express.Router();
const User = require("../models/Userschema");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

//to check the token and create secure commmunication

const JWT_SECRET = "abhiisgood$boy";

//Route 1
//create a user using : POST "/api/auth/".dosent require Auth

router.post(
  "/createuser",
  [
    body("name", "Enter a valid Name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "passowrd must be atleast 5 character Long ").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //if there are error return bad request and errror
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check whether the user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      console.log(user);
      if (user) {
        return res.status(400).json({ errors: errors.array() });
        return res.status(400).json({ errors: "sorry user already existed" });
      }
      const salt = await bcrypt.genSalt(10);
      const secpass = await bcrypt.hash(req.body.password, salt);
      //create a user
      user = await User.create({
        name: req.body.name,
        password: secpass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      //sending id to user
      const authtoken = jwt.sign(data, JWT_SECRET);

      res.json(authtoken);
      //catchig the error
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internel error occure");
    }
  }
);

//ROUTE 2

//authenticate a user
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//ROUTE 3
//get login user reqeuest using "post:/api/auth.loginrequest"
router.post("/getuser",  async (req, res) => {
    try {
      userId = "tOdoo";
      const user = await User.findById(userId).select("-password");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);
module.exports = router;
