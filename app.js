if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const ejsMate=require("ejs-mate");
const methodOverride=require("method-override");
const path=require("path");
const reviewRouter=require("./routes/review.js");
const ExpressError=require("./utils/ExpressError.js");
const listingRouter=require("./routes/listing.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');

const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const user=require("./routes/user.js");
const { constants } = require('buffer');



const dbUrl=process.env.ATLASDB_URL;


main()
.then((res)=>{
    console.log("connected to db");
}).
catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("error in mongo session",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*1000*60*60*24*3,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};

// app.get("/",(req,res)=>{
//     res.send("Hello World");
// });




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})



// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         username:"demouser",
//         email:"demouser12@gmail.com"
//     });
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });




app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
});


app.use((err,req,res,next)=>{

    let{statusCode=500,message="something wrong"}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("./listings/error.ejs",{err});
});



app.listen("8080",()=>{
    console.log("server is running on port 8080")
});




// app.get("/testListing",async(req,res)=>{
//     let sampleLisiting= new Listing({
//         title:"my villa",
//         description:"my villa is a beautiful villa",
//         price:1200,
//         location:"goa",
//         country:"India"
//     });
//     await sampleLisiting.save();
//     console.log("sample saved");
//     res.send("sample saved");
// });
