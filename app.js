require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); 

const MONGO_URL= process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override"); 
const ejsMate = require("ejs-mate");
const serveStatic = require("serve-static");


main().then(() => {
    console.log("connected to DB");
   // console.log("value of __dirnapublicme :", __dirname);
})
.catch(err => {
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL)
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate );
app.use(express.static(path.join(__dirname, "public")));
app.use(serveStatic(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});


//Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("../Views/index.ejs", { allListings });
});

app.get("/public/css/style.css", (req, res) => {
    res.setHeader("Content-Type", "text/css");
    res.sendFile(__dirname+"/public/css/style.css"); // Replace with actual file path
  });

//New Route
app.get("/listings/new", (req, res) => {
    res.render("../Views/listings/new.ejs");
});


//Show Route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("../Views/show.ejs", { listing });
});


//create Route
app.post("/listings", async(req, res) => {
   const newListing = new Listing(req.body.listing);
   await newListing.save();
   res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
   // console.log("Inside Edit api########");
    let { id } = req.params;
    const listing = await Listing.findById(id);  
   // console.log("listing####",listing);  
    res.render("/home/mayank/Documents/Practice Projects/SampleProject/Views/listings/edit.ejs", { listing });
});

//update Route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params; 
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete ("/listing/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

/*

app.get("/testListing", async (req, res) => {
 let sampleListing = new Listing({
    title:"My New Villa",        
    description:"By the beach", 
    price:1200,
    location: "calangute, Goa",
    country:"India"
});
    await sampleListing.save();
    console.log("sample was saved");
    res.send("successfull testing");
}); */

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});

