const express = require("express");
const app = express();

const subscriberModel = require("../models/subscribers");
const userModel = require("../models/user-model");
const { generateToken } = require("../utils/generatetoken");
const isLoggedIn = require("../middleware/isLoggedIn");

const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Your code goes here

app.get("/", (req, res) => {
  res.render("index");
});


//user register


app.post("/create", async (req, res) => {
  const registeredUser = await userModel.findOne({
    email: req.body.email,
  });

  if (registeredUser) {
    res.send("you are already registered");
  } else {
    let { fullname, email, password } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        const user = await userModel.create({
          fullname,
          email,
          password: hash,
        });
        const token = generateToken(user);
        res.cookie("token", token);
        res.redirect("/home");
      });
    });
  }
});

//user logout

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

//user login

app.post("/login", async (req, res) => {
  let { email, password } = req.body;

  const user = await userModel.findOne({
    email,
  });
  if (!user) {
    res.send("something went wrong plz try again");
  } else {
    bcrypt.compare(password, user.password, (err, result) => {
      if (!result) {
        res.send("something went wrong");
      } else {
        const token = generateToken(user);
        res.cookie("token", token);
        res.redirect("/home");
      }
    });
  }
});

//home page

app.get("/home", isLoggedIn,async (req, res) => {
  res.render("home");
});

//subscribers api

app.get("/subscribers", isLoggedIn, async (req, res) => {
  const subscribers = await subscriberModel.find();
  res.json(subscribers);
});

app.get("/subscriber/create",isLoggedIn, (req, res) => {
  res.render("subscriber-create");
});
app.post("/subscribercreate", isLoggedIn, async (req, res) => {
  let { name, subscribedChannel } = req.body;
  const subscriberUser = await subscriberModel.create({
    name,
    subscribedChannel
  });

  res.json(subscriberUser);
});

//subscribers/names api

app.get("/subscribers/names", isLoggedIn, async (req, res) => {
  const subscribers = await subscriberModel
    .find()
    .select("-_id")
    .select("-subscribedDate")
    .select("-__v");
  res.json(subscribers);
});

//subscriber search by id

app.get("/subscribers/:id", async (req, res) => {
  const subscriber = await subscriberModel.findOne({
    _id: req.params.id,
  });
  res.json(subscriber);
});

module.exports = app;
