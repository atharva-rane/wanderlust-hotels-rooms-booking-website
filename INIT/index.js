const mongoose = require("mongoose");
let initData = require("./data.js");
let Listing = require("../MODELS/listing.js");

let mongoURL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
.then((res) => {
    console.log("Database Connected")
})
.catch(err => {console.log("Error: ", err)});

async function main() {
    await mongoose.connect(mongoURL);
}

const initDb = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialised.")
}

initDb();