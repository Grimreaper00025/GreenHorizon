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

app.get("/client", function(req,res){
    res.render("client", { t: t });
});

app.get("/sendEmail", function(req, res){
    res.render("sendEmail", {t:t});
});

app.get("/student", async function(req, res){
    try {
        const users = await User.find({});
        res.render("student", { t: t, users: users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("")
app.listen(3000,function()
{
    console.log("Server Started on port on 3000");
});