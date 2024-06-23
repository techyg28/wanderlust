const express = require("express"); 
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controller/listing.js");
// To parse file data & store file data
const multer  = require('multer');
const Listing = require("../models/listing.js");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage}); // multer uploads it in cloud storage

// To write code in more compact fashion and avoid duplicacy
// Create Route
router.get("/new",
    isLoggedIn,
    listingController.renderNewForm);

router
  .route("/")
    .get(wrapAsync(listingController.index)) // Index Route
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing));

router
   .route("/:id")
   .get(
    wrapAsync(listingController.showListing)) // Show Route
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing)) 
    .delete(
            isLoggedIn,
            isOwner,
            wrapAsync(listingController.deleteListing));

// Edit Route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));

module.exports=router;