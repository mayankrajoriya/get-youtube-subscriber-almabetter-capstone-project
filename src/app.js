const express = require("express");
const app = express();

const subscriberModel = require("../models/subscribers");


const path = require("path");

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



//subscribers api

app.get("/subscribers", async (req, res) => {
  const subscribers = await subscriberModel.find();
  res.json(subscribers);
});

app.get("/subscriber/create", (req, res) => {
  res.render("subscriber-create");
});
app.post("/subscribercreate", async (req, res) => {
  try{
    let { name, subscribedChannel } = req.body;
  const subscriberUser = await subscriberModel.create({
    name,
    subscribedChannel
  });

  res.status(201).json(subscriberUser);
  }
  catch(error){
    res.status(400).send("server error",error)
  }
});

//subscribers/names api

app.get("/subscribers/names",  async (req, res) => {
  const subscribers = await subscriberModel
    .find()
    .select("-_id")
    .select("-subscribedDate")
    .select("-__v");
  res.status(200).json(subscribers);
});

//subscriber search by id

app.post('/subscribersid',async (req, res) => {
  
  res.redirect(`/subscribers/${req.body.subscriberid}`);
});



app.get("/subscribers/:id", async (req, res) => {
  const subscriber = await subscriberModel.findOne({
    _id: req.params.id,
  });
  if(subscriber){
    res.status(200).send(subscriber);

  }else{
    res.status(404).send("Id does not exist")
  }
});

module.exports = app;
