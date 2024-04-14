const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
var bcrypt = require("bcryptjs");
const _ = require("lodash");
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const router = express.Router();

var test = 0;
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
    secret: 'TooToo',
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
     password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
     },
     confirmPassword: String
});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home", { test: test });
});

app.get("/home", function(req, res){
    res.render("home", {test:test});
});

app.post("/",function(req,res){
    res.render("home", {test:test});
});

app.post("/#", function(req,res){
    res.render("home", {test:test});
})

app.get("/signup",function(req,res)
{
    res.render("signup", { test: test });
});

app.get("/login",function(req,res)
{
    res.render("login", { test: test });
});

app.post("/logout", function(req, res) {

    req.session.destroy(function(err) {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
       
        res.redirect("/login");
    });
});

if (test===0)
{app.post("/signup", async function (req, res) {
    const { name, mobno, username, email, gender,password, confirmPassword } = req.body;
  

    if (password !== confirmPassword) {

        return res.render("signup", { 
            error: "Passwords do not match",
            name,
            mobno,
            username,
            email,
            gender
        });
    }
    
    try {

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            mobno,
            username,
            email,
            gender, 
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
          
            test=1;
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

if(test===1){
    app.post("/profile", async function (req, res){

    })
}

app.get("/profile", function(req, res){
    if(test===1)
    {res.render("profile", {test: test, user: user});}
    else{res.redirect("/signup")};
});

app.get("/sendEmail", function(req, res){
    res.render("sendEmail", {test:test});
});
app.get("/carbon-calculator", function(req, res){
    res.render("carbon-calculator", {test:test});
});
app.get("/savings", function(req, res){
    res.render("savings", {test:test});
});
app.get("/installation", function(req, res){
    res.render("installation", {test:test});
});

app.post('/carbon-calculator', (req, res) => {
    console.log(req.body);
    const numPeople = parseInt(req.body.numpeople);
    const housingSize = parseInt(req.body.Size);
    const electricityConsumption = parseInt(req.body.Electricty);
    const bedrooms = parseInt(req.body.Bedrooms);
    const electronic=parseInt(req.body.Electronics);
    const housingType = req.body.housing_type;
    const laptop = req.body.laptop === 'on' ? true : false;
    const tv = req.body.tv === 'on' ? true : false;
    const washing = req.body.washing === 'on' ? true : false;
    const fridge = req.body.fridge === 'on' ? true : false;
    const  ac= req.body.ac === 'on' ? true : false;
    const table = req.body.table === 'on' ? true : false;
    const solarPanel=req.body.solar_panel==='on'?true:false;
    const solarWaterHeater = req.body.solar_water_heater === 'on' ? true : false;
    const otherCleanEnergy = req.body.other_clean_energy === 'on' ? true : false;
    const energySavingBulbs = req.body.energy_saving_bulbs === 'on' ? true : false;
    const vehicleType = req.body.Vehicle;
    const distanceTravelled = parseInt(req.body.distance_travelled);
    const flightHours = parseInt(req.body.flight_hours);
    const offsetFlights = req.body.offset_flights === 'on' ? true : false;
    const housingDiet = req.body.housing_diet;
    const clothesFootwearSpending = parseInt(req.body.clothes_footwear_spending);
    const eatOutFrequency = parseInt(req.body.eat_out_frequency);
    const healthBeautySpending = parseInt(req.body.health_beauty_spending);
    let carbonCredit=0;

    if(housingType==="stand_alone")
    {
        carbonCredit=carbonCredit+(housingSize*numPeople*35);
        carbonCredit=carbonCredit+(housingSize*3.5*bedrooms*numPeople);
        carbonCredit=carbonCredit+(4.5*electricityConsumption);
        console.log(carbonCredit);
    }
    else if(housingType==="flat")
    {
        carbonCredit=carbonCredit+(housingSize*numPeople*25);
        carbonCredit=carbonCredit+(housingSize*2.5*bedrooms*numPeople);
        carbonCredit=carbonCredit+(3.5*electricityConsumption);
    }
    else{
        carbonCredit=carbonCredit+(housingSize*numPeople*15);
        carbonCredit=carbonCredit+(housingSize*1.5*bedrooms*numPeople);
        carbonCredit=carbonCredit+(2.5*electricityConsumption);
    }

    if(laptop)
    {
        carbonCredit=carbonCredit+750;
    }
    if(tv)
    {
        carbonCredit=carbonCredit+300;
    }
    if(washing)
    {
        carbonCredit=carbonCredit+600;
    }
    if(fridge)
    {
        carbonCredit=carbonCredit+1350;
    }
    if(ac)
    {
        carbonCredit=carbonCredit+3000;
    }
    if(table)
    {
        carbonCredit=carbonCredit+150;
    }

    if(solarPanel)
    {
        carbonCredit=carbonCredit-15000;
    }
    if(solarWaterHeater)
    {
        carbonCredit=carbonCredit-1800;
    }
    if(otherCleanEnergy)
    {
        carbonCredit=carbonCredit-13200;
    }
    if(energySavingBulbs)
    {
        carbonCredit=carbonCredit-1350;
    }

    carbonCredit=carbonCredit+clothesFootwearSpending+healthBeautySpending;

    if(offsetFlights)
    {
        carbonCredit=carbonCredit-4200;
    }

    if(vehicleType==="car")
    {
        carbonCredit=carbonCredit+(500*distanceTravelled);
    }
    else if(vehicleType==="bike")
    {
        carbonCredit=carbonCredit+(200*distanceTravelled);
    }
    else if(vehicleType==="public")
    {
        carbonCredit=carbonCredit+(50*distanceTravelled);
    }
    else if(vehicleType==="e-car")
    {
        carbonCredit=carbonCredit+(300*distanceTravelled);
    }else if(vehicleType==="e-bike")
    {
        carbonCredit=carbonCredit+(50*distanceTravelled);
    }
    else if(vehicleType==="cycle")
    {
        carbonCredit=carbonCredit+(20*distanceTravelled);
    }
    else 
    {
        carbonCredit=carbonCredit+(10*distanceTravelled);
    }

    carbonCredit=carbonCredit+(1700*numPeople*flightHours);

    if(housingDiet==="Meat_love")
    {
        carbonCredit=carbonCredit+(numPeople*900*eatOutFrequency);
    }
    else if(housingDiet==="Meat")
    {
        carbonCredit=carbonCredit+(numPeople*500*eatOutFrequency);
    }
    else if(housingDiet==="Vegetarian")
    {
        carbonCredit=carbonCredit+(numPeople*200*eatOutFrequency);
    }
    else
    {
        carbonCredit=carbonCredit+(numPeople*100*eatOutFrequency);
    }

    res.render('result-carbon', { carbonCredit: carbonCredit ,test:test});
});

app.post("/savings", function(req,res)
{
    var number=parseInt(req.body.number);
    var unit=parseInt(req.body.unit);
    var cost=number*unit;
    console.log(cost);
    var area=parseInt(req.body.area);
    var solarCost=((Math.floor(area/120))*140)*unit;
    console.log(solarCost);
    var savings=Math.abs(solarCost-cost);
    console.log(savings);
    var percentage=(savings/cost)*100;
    console.log(percentage);
    var costSolar=50000*(Math.floor(area/120));
    console.log(costSolar);
    var months=costSolar/solarCost;
    console.log(months);
    var years=months/12;
    console.log(years);
    var Percentage=100-parseInt(percentage);
    console.log(Percentage);
    var Years=parseInt(Math.round(years));
    console.log(Years);

    res.render("result-savings",{Percentage:Percentage,test:test,Years:Years});
});

// app.post("/installation",function(req,res)
// {
//     const coordinates = req.body.coordinates;
//     console.log('Received coordinates:', coordinates);
//     res.json({ message: 'Coordinates received successfully!' });

//     const { getJson } = require("serpapi");
//     getJson({
//       engine: "google_maps",
//       q: "Solar Panel Installers",
//       ll: "@40.7455096,-74.0083012,15.1z",
//       type: "search",
//       api_key: "f19eaa809ba2e4662bad9e6a8a999bc5738a7449e4269c8392220bf121391c2f"
//     }, (json) => {
//       console.log(json["local_results"]);
//     });
//     const localResults = json["local_results"];
//     const topInstallers = [];

//     // Iterate over the local_results array
//     for (let i = 0; i < Math.min(4, localResults.length); i++) {
//         const installer = localResults[i];
        
//         // Extract required information
//         const name = installer.title;
//         const phone = installer.phone;
//         const reviews = installer.reviews;
//         const rating = installer.rating;
//         const website = installer.website;
//         const userReview = installer.user_review;

//         // Store information in an object
//         const installerInfo = {
//             name,
//             phone,
//             reviews,
//             rating,
//             website,
//             userReview
//         };

//         // Add installer info to the topInstallers array
//         topInstallers.push(installerInfo);
//     }

//     // Now topInstallers array contains information about the top 4 installers
//     console.log(topInstallers);

// });

// app.post("/installation", function(req, res) {
//     const coordinates = req.body.coordinates;
//     console.log('Received coordinates:', coordinates);
//     const { getJson } = require("serpapi");
//     const [latitude, longitude] = coordinates.split(',');
//     console.log(latitude);
//     const string="@"+latitude+","+longitude+","+"15.1z";

//     getJson({
//       engine: "google_maps",
//       q: "Solar Panel",
//       ll: string,
//       type: "search",
//       api_key: "f19eaa809ba2e4662bad9e6a8a999bc5738a7449e4269c8392220bf121391c2f"
//     }, (json) => {
//       console.log(json["local_results"]);
//       const localResults = json.local_results || [];
//         const topInstallers=[];


//         for (let i = 0; i < Math.min(4, localResults.length); i++) {
//             const installer = localResults[i];
            

//             const name = installer.title;
//             const phone = installer.phone;
//             const reviews = installer.reviews;
//             const rating = installer.rating;
//             const website = installer.website;
//             const userReview = installer.user_review;


//             const installerInfo = {
//                 name,
//                 phone,
//                 reviews,
//                 rating,
//                 website,
//                 userReview
//             };

//             // Add installer info to the topInstallers array
//             topInstallers.push(installerInfo);
//         }

//         // Now topInstallers array contains information about the top 4 installers
//         console.log('Top installers:', topInstallers);

//         res.render("installation",{test:test,topInstallers:topInstallers});
    
//     }); 
//     });


app.post("/installation",function(req,res){
    var Coordinates = req.body.coordinates;
    const [latitude, longitude] = Coordinates.split(',');
    var location= "@"+latitude+","+longitude+","+"15.1z";
    var topInstallers =[];
    const { getJson } = require("serpapi");
  getJson({
    engine: "google_maps",
    q: "solar panel installation ",
    ll: location,
    type: "search",

    api_key: "f19eaa809ba2e4662bad9e6a8a999bc5738a7449e4269c8392220bf121391c2f"
  }, (json) => {
    console.log(json["local_results"]);
      const localResults = json.local_results || [];
        const topInstallers=[];


        for (let i = 0; i < Math.min(6, localResults.length); i++) {
            const installer = localResults[i];
            

            const name = installer.title;
            const phone = installer.phone;
            const reviews = installer.reviews;
            const rating = installer.rating;
            const website = installer.website;
            const userReview = installer.user_review;


            const installerInfo = {
                name,
                phone,
                reviews,
                rating,
                website,
                userReview
            };
            topInstallers.push(installerInfo);}
     
     res.render("install",{topInstallers:topInstallers,test:test});
     
  });
});


app.listen(3000,function()
{
    console.log("Server Started on port on 3000");
});
