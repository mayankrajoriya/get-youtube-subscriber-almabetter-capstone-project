const express = require('express')
const app = require('./src/app.js')
const mongoose = require('mongoose')
const port = 3000
const dotenv=require("dotenv")
const path=require("path")

dotenv.config();

// Parse JSON bodies (as sent by API clients)
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));


// Connect to DATABASE
const DATABASE_URL = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.odb2xeh.mongodb.net/youtube?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(DATABASE_URL,{ useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection
db.on('error', (err) => console.log(err))
db.once('open', () => console.log('connected to database'))

// Start Server
app.listen(port, () => console.log(`App listening on port ${port}!`))
