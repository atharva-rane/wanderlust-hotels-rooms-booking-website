const express = require("express");
const app = express();
const mongoose = require("mongoose");
let Listing = require("./MODELS/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./UTILS/wrapAsync.js");
const ExpressError = require("./UTILS/ExpressError.js");
const listingSchema = require("./schema.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

let mongoURL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then((res) => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log("Error: ", err);
  });

async function main() {
  await mongoose.connect(mongoURL);
}

app.get("/", (req, res) => {
  res.send("This is root page.");
});

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
      throw new ExpressError(400, error);
    }else{
      next();
    }
}

app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("LISTINGS/index", { allListings });
  })
);

// New Route
app.get("/listings/new", (req, res) => {
  res.render("LISTINGS/new");
});

// Show Route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("LISTINGS/show", { listing });
  })
);

// Create Route
app.post(
  "/listings", 
  validateListing,
  wrapAsync(async (req, res, next) => {
    // let {title, description, image, price, location, country} = req.body;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// Update Route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("LISTINGS/edit", { listing });
  })
);

app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {

    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let delList = await Listing.findByIdAndDelete(id);
    console.log(id);
    res.redirect("/listings");
  })
);

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

// app.use("*", (req, res, next) => {
//   next(new ExpressError(404, "Page not found"));
// });

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Somenthing went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("App listening on port 8080");
});
