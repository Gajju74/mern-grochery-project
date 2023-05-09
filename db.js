const mongoose = require("mongoose")
require("dotenv").config();

const mongoURL = process.env.DATABASE;


const mongoDB = async () => {
    try {
        await mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("mongo db connected");
        
    } catch (error) {
        console.log("mongo db not connect");
    }
}


module.exports = mongoDB;
