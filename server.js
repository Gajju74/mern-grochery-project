const express = require('express')
const app = express()
const cors = require("cors");
const mongoDB = require("./db")
mongoDB();
const PORT = process.env.PORT || 8000


// app.use((req, res,  next)=>{
//     res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     next();
// })


app.get('/', function(req, res) {
  res.send('hello world')
})

app.use(cors());
app.use(express.json());
app.use('/api', require('./Router/Auth'))


app.listen(PORT, function(req, res) {
    console.log(`Server start at port no ${PORT}`);
});