const express = require("express");
// Router divides the big code into smaller chuncks to make it more readable.
const router = express.Router({mergeParams:true}); // to merge parent route with child route
const wrapAsync = require("../utils/wrapAsync.js");
const reviewController = require("../controller/reviews.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
// post of review
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview));

// delete review route 
//pull operator removes from an existing array all instances of a value or
// values that matches a specific condition 
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);
module.exports = router;