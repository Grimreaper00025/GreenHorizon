const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const router = express.Router();

var t = 0;
app.use(express.json());

mongoose.connect('mongodb+srv://inficos0520:yj9vtx3zJhYSgw6i@gh.zc3syn3.mongodb.net/?retryWrites=true&w=majority&appName=GH/userDB');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.static(path.join(__dirname, 'views')));

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'Views'));
app.use('/form', express.static(__dirname + '/index.html'));




app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("Public"));
app.set('trust proxy', 1);


app.use(session({
    secret: 'foo',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://inficos0520:yj9vtx3zJhYSgw6i@gh.zc3syn3.mongodb.net/?retryWrites=true&w=majority&appName=GH/userDB' })
}));


app.use(function(req, res, next) {
    if (!req.session) {
        return next(new Error('Oh no'))
    }
    next();
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to MongoDB!");
});

module.exports = db;
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "can't be blank"]
     },
    mobno: {
        type: Number,
        match: /^\d{10}$/, 
        required: [true, 'Mobile number is required'],
        unique: true,
    },
    username: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        index: true,
        unique: true
     },
     email: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
     },
     gender: String,
     school: String,
     course: String,
     degree: String,
     passout: Number,
     currentYear: Number,
     linkedProfile: String,
     github: String,
     skills: [String],
     pastProjects: [String],
     country: String,
     password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
     },
     confirmPassword: String
});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home", { t: t });
});

app.get("/home", function(req, res){
    res.render("home", {t:t});
});

app.post("/",function(req,res){
    res.render("home", {t:t});
});

app.post("/#", function(req,res){
    res.render("home", {t:t});
})

app.get("/signup",function(req,res)
{
    res.render("signup", { t: t });
});

app.get("/login",function(req,res)
{
    res.render("login", { t: t });
});

if (t===0)
{app.post("/signup", async function (req, res) {
    const { name, mobno, username, email, gender, school, course, degree, passout, currentYear, linkedProfile, github, skills, pastProjects, password, confirmPassword } = req.body;
  

    if (password !== confirmPassword) {

        return res.render("signup", { 
            error: "Passwords do not match",
            name,
            mobno,
            username,
            email,
            gender, school, course, degree, passout, currentYear, linkedProfile, github, skills, pastProjects
        });
    }
    
    try {

        const hashedPassword = await bcrypt.hash(password, 10);
    

        const newUser = new User({
            name,
            mobno,
            username,
            email,
            gender, school, course, degree, passout, currentYear, linkedProfile, github, skills, pastProjects,
            password: hashedPassword
        });
    

        await newUser.save();
    
        res.redirect("/login"); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create user" });
    }
});
}

var user;

app.post("/login", async function (req, res) {
    const { loginUsername, loginPassword } = req.body;

    try {

        user = await User.findOne({ username: loginUsername });

        console.log(user);
        console.log(loginUsername);

        if (!user) {
            console.log("User not found");
            return res.render("login", { error: "Invalid username or password" });
        }


        const isPasswordMatch = await bcrypt.compare(loginPassword, user.password);

        if (isPasswordMatch) {
          
            t=1;
            console.log("User authenticated successfully");
            res.redirect("/");
        } else {

            console.log("Invalid password");
            return res.render("login", { error: "Invalid username or password" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

if(t===1){
    app.post("/profile", async function (req, res){

    })
}

app.get("/profile", function(req, res){
    if(t===1)
    {res.render("profile", {t: t, user: user});}
    else{res.redirect("/signup")};
});

app.get("/sendEmail", function(req, res){
    res.render("sendEmail", {t:t});
});
app.get("/carbon-calculator", function(req, res){
    res.render("carbon-calculator", {t:t});
});
app.get("/savings", function(req, res){
    res.render("savings", {t:t});
});




app.post("/carbon-calculator",async function(req,res){    
    var numpeople = req.body.numpeople;
    var electricity=req.body.electricity;
    var cylinders= req.body.cylinders;
    var flights = req.body.flights;
    var vehicle= req.body.vehicle;
    var mileage =req.body.mileage;
    var newspaper= req.body.newspaper;
    var aluminium = req.body.aluminium;
    var bus= req.body.bus;
    var train = req.body.train;
    var electricityprint= (electricity*0.82)/numpeople;
    var cylinderprint = (cylinders*23.5)/numpeople;
    var petrol= vehicle/mileage;
    var petrolprint= (petrol*2.3)/numpeople;
    var flightprint= (flights*242)/numpeople;
    var busprint = (bus*0.1)/numpeople;
    var trainprint = (train*0.27)/numpeople;
    var foodprint=0;

    if(req.body.meatLover==="re")
    foodprint=foodprint+108;
    else if(req.body.omnivore==="re")
    foodprint=foodprint+83;
    else if(req.body.vegetarian==="re")
    foodprint=foodprint+55;
    else if(req.body.vegan==="re")
    foodprint=foodprint+46;
    var footprint = (electricityprint+cylinderprint+petrolprint+flightprint+foodprint+busprint+trainprint);
    console.log(footprint)
    percentages=[((electricityprint/footprint))*100,((cylinderprint/footprint)*100),(((petrolprint+flightprint+trainprint+busprint)/footprint))*100,((foodprint/footprint)*100)];
    
    if(newspaper=== undefined)
    footprint=footprint+89/numpeople;
    if(aluminium=== undefined)
    footprint=footprint+75/numpeople;
    let area=footprint/2750;
    area=area*2.471;
    area=Math.round(area);
    var indiaResult ;
    var indiaResultSub;
    
   footprint=Math.round(footprint)
    if(footprint>580)
    {
        indiaResult="Bad"
        indiaResultSub="Your Emission levels exceed India's average by"+" "+Math.round((footprint)/5.80)+"%"
    }
    else if(footprint<=580)
    {
        indiaResult="Great!"
        indiaResultSub="Your Emission levels are below India's average by"+" "+Math.round((580-footprint)/5.80)+"%"
    }

    res.render("result-carbon",{footprint:footprint,percentages:percentages,indiaResult:indiaResult,indiaResultSub:indiaResultSub,area:area,t:t})
});
app.post("/savings", function(req,res)
{
    var number=req.body.number;
    var unit=req.body.unit;
    var cost=number*unit;
    console.log(cost);
    res.render("result-savings",{cost:cost,t:t});
});
app.listen(3000,function()
{
    console.log("Server Started on port on 3000");
});
