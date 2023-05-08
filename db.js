const mongoose = require("mongoose")

const mongoURL =  process.env.DATABASE


const mongoDB = async () => {
    try {
        await mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("connected mongo db");
        
    } catch (error) {
        console.log("mongo db not connect");
    }
}


module.exports = mongoDB;
