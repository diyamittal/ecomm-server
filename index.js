const express=require("express");
const cors = require("cors");
require('./db/config');
const User = require('./db/User');
const Product = require('./db/Product')
const Location = require('./db/Location')
const app= express();
const paymentController = require('./controllers/paymentController.js')
const mongoose = require('mongoose');
const Jwt = require('jsonwebtoken');
const jwtKey = 'e-comm';

const port = process.env.PORT || 5000;

const verifyToken = require('./middleware/auth')

mongoose.connect("mongodb://127.0.0.1:27017/e-comm");

app.use(express.json());
app.use(cors(
    {
        origin: "*",
        methods: ["POST", "GET", "DELETE"],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    }
));

app.options('*', cors());

app.post("/register", async(req, res)=>{

    const existingUser = await User.findOne({email: req.body.email});
    if(existingUser){
        return res.status(400).json({error: 'User already exist'});
    }
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    Jwt.sign({result}, jwtKey, (err, token)=>{
        if(err){
            res.send({result: "something went wrong, Please try after some time"})
        }
        res.send({result, auth: token})
    })
})

app.post("/login", async (req, res)=>{
    if(req.body.password && req.body.email){
        let user = await User.findOne(req.body).select("-password");
        if(user){
            Jwt.sign({user}, jwtKey, (err, token)=>{
                if(err){
                    res.send({result: "something went wrong, Please try after some time"})
                }
                res.send({user, auth: token})
            })
        }
        else{
            res.send({result: 'No User Found'})
        }
    }
    else{
        res.send({result: 'No User Found'})
    }
})

app.post("/add-product", verifyToken, async (req, res)=>{
    let product = new Product(req.body);
    let result = await product.save();
    res.send(result)
})

app.get("/products", verifyToken, async(req, res)=>{
    let products = await Product.find();
    if(products.length>0){
        res.send(products)
    }
    else{
        res.send({result:"No Products found"})
    }
})

app.post("/add-location", async (req, res)=>{
    let location = new Location(req.body);
    let result = await location.save();
    res.send(result)
})

app.delete("/products", async (req, res)=>{
    try{
        const result = await Product.deleteMany({})
    }
    catch(error){
        console.log("error");
    }
})

app.delete("/products/:id", verifyToken, async (req, res)=>{
    try {
        const result = await Product.deleteOne({id: req.params.id});
        if (result.deletedCount === 1) {
            res.send({ message: "Product deleted successfully" });
        } else {
            res.status(404).send({ error: "Product not found" });
        }
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send({ error: "Internal server error" });
    }
})

app.listen(port);