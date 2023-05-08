const express = require("express");
const router = express.Router()
const User = require("../models/User")
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const { json } = require("react-router-dom");
const jwtScrete = "MYNAMEISNEWUSER"

router.post('/createuser', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10)
    const secPassword = await bcrypt.hash(req.body.password, salt)

    try {
        const existingUser = await User.findOne({ email: req.body.email })
        if (existingUser) {
            return res.status(400).json({ errors: "A user is already registered with this email address."});
        }

        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPassword
        })

        res.json({ success: true });

    } catch (error) {
        console.log(error);
        res.json({ success: false });

    }
})


router.post('/loginuser', async (req, res) => {

    const email = req.body.email
    try {
        const userdata = await User.findOne({email})
        if(!userdata){
            return res.status(400).json({ errors: "please try valide data"});
        }
        const pwdCompare = await bcrypt.compare(req.body.password, userdata.password)
        if (!pwdCompare) {
            return res.status(400).json({ errors: "please try valide password"});
        }
        const data = {
            user:{
                id: userdata.id
            }
        }

        const authToken = jwt.sign(data, jwtScrete)
        return res.json({ success: true, authToken:authToken});
    
    } catch (error) {
        console.log(error);
        res.json({ success: false });

    }

})

router.post("/orderdata", async(req, res) => {
    const data = req.body.order_data
    await data.splice(0,0,{Order_date:req.body.order_date})
    const emailID = await Order.findOne({'email': req.body.email})
    console.log(emailID);
    if (emailID === null) {
        try {
            await Order.create({
                email: req.body.email,
                order_data : [data]
            }).then(() => {
                res.json({ success: true })
            })
        } catch (error) {
            console.log(error.message)
            res.send("Server Error", error.message)

        }      
    }
    else {
        try {
            await Order.findOneAndUpdate({email:req.body.email},
                { $push:{order_data: data} }).then(() => {
                    res.json({ success: true })
                })
        } catch (error) {
            console.log(error.message)
            res.send("Server Error", error.message)
        }
    }
})

router.post('/myOrderData', async (req, res) => {
    try {
        // console.log(req.body.email)
        let eId = await Order.findOne({ 'email': req.body.email })
        //console.log(eId)
        res.json({orderData:eId})
    } catch (error) {
        res.send("Error",error.message)
    }
    

});

module.exports = router;