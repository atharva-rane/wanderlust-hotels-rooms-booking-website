const express = require("express");
const app = express();
const mongoose = require("mongoose");
let Listing = require("./MODELS/listing.js");
const path = require("path");
const methodOverride = require('method-override')

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

let mongoURL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
.then((res) => {
    console.log("Database Connected")
})
.catch(err => {console.log("Error: ", err)});

async function main() {
    await mongoose.connect(mongoURL);
}

app.get("/", (req,res) => {
    res.send("This is root page.")
});

app.get("/listings", async (req,res) => {
    const allListings = await Listing.find({});
    res.render("LISTINGS/index", {allListings});
});

// New Route
app.get("/listings/new", (req,res) => {
    res.render("LISTINGS/new");
})

// Show Route
app.get("/listings/:id", async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("LISTINGS/show", {listing});
})

// Create Route
app.post("/listings", async (req,res) => {
    // let {title, description, image, price, location, country} = req.body;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
})

// Update Route
app.get("/listings/:id/edit",async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("LISTINGS/edit", {listing});
})


app.put("/listings/:id", async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})


//Delete Route
app.delete("/listings/:id", async (req,res) => {
    let {id} = req.params; 
    let delList = await Listing.findByIdAndDelete(id);
    console.log(id);
    res.redirect("/listings");
}) 

// app.get("/testListings", async (req,res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Goa",
//         country: "India",
//     })

//     await sampleListing.save();
//     console.log("Sample was saved.")
//     res.send("Route working successfully.");
// })

app.listen(8080, () => {
    console.log("App listening on port 8080");
})