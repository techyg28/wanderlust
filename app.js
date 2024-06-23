// This is to ensure that environment variables should not 
// upload in production phase ( Only for development phase )
if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
const dbUrl= process.env.ATLASDB_URL; 
const express = require("express");
const app = express();
const path = require("path");
// session local storage is only for development phase
const session = require("express-session");
const MongoStore = require("connect-mongo");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// cookie saves a login info in browser so that we don't have to re login in short period of time.
// To set time period we set expiry date of cookie default is null

// This session related info stores on cloud
const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
        touchAfter : 24*3600,// interval (in seconds between session updates)
    }
});

store.on("error",()=>{
    console.log("Error in mongo session store.",err);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000, // 1 week in ms
        maxAge : 7*24*60*60*1000,
        httpOnly : true //security purpose to prevent cross scripting attacks
    }
}
app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in localStrategy
passport.use(new LocalStrategy(User.authenticate()));
// storing user related information like login info when session starts
passport.serializeUser(User.serializeUser());
// removing user related information like login info when session ends
passport.deserializeUser(User.deserializeUser());

app.get("/demouser",async (req,res)=>{
    let fakeUser = new User({
        email : "student@gmail.com",
        username : "delta-student",
    }); // user & password demo1 & demo1#123
    let registeredUser = await User.register(fakeUser,"hello#123");
    res.send(registeredUser);
})
app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser = req.user;
    next();
}) 

// To use requests other than get or post
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// To use post request body data
app.use(express.urlencoded({extended : true}));

// To serve static files
app.use(express.static(path.join(__dirname,"public")));

// To render ejs templates
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// For creating templates
const ejsMate = require("ejs-mate");
app.engine('ejs',ejsMate);

// Start the server
app.listen(8080,()=>{
    console.log("server is listening....");
});

// Set database connection
const mongoose = require('mongoose');
main()
.then(()=>{console.log("connection successfull...")})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

// app.get("/",(req,res)=>{
//     res.send("working");
// });
// use "reviews" in place of "/listings/:id/reviews" (common path)
// const listings = require("./routes/listing.js"); Parent route
// const reviews = require("./routes/review.js");

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// middleware to handle error 
// if request is not matched with any route then express will use this middleware
app.all('*',(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});
// catches the error
app.use((err,req,res,next)=>{
    let {statusCode=500, message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
});