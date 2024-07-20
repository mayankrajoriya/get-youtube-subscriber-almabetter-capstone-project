const mongoose = require('mongoose')
const subscriberModel = require('../models/subscribers')
const data = require('./data')
dotenv.config();

// Connect to DATABASE
const DATABASE_URL =`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.odb2xeh.mongodb.net/youtube?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(DATABASE_URL,{ useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection
db.on('error', (err) => console.log(err))
db.once('open', () => console.log('Database created...'))

const refreshAll = async () => {
    await subscriberModel.deleteMany({})
    // console.log(connection)
    await subscriberModel.insertMany(data)
    await mongoose.disconnect();
}
refreshAll()