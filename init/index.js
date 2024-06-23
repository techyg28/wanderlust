const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// establishing connection with database
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
// Initializing the database
const initDB = async () => {
  await Listing.deleteMany({});
  // creates a new field in db
  initData.data = initData.data.map((obj)=>({...obj, owner :"66728f9cf8e0a4f6bf4c85ca"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
