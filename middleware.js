// user must be logged in before creating a new listings 
// isAuthenticate is passport method. session stores user info.
const Listening = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        // by default passport delete session info after login
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in!");
        return res.redirect("/login");
    }
    next();
};
// to save it in locals
module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl)
        res.locals.redirectUrl= req.session.redirectUrl;
    next();
};
// Authentication to check the owner
module.exports.isOwner = async (req, res, next) => {
    let  {id} = req.params;
    let listing = await Listening.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error","You're not the owner of the listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
    let  {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error","You're not the author of the review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// middleware to handle validation errors for server side
module.exports.validateListing = (req,res,next) => {
    // req sent from hopscoch with empty body
    let {error} =listingSchema.validate(req.body);
    console.log(error);
    if(error) {
        throw new ExpressError(400, error);
    }
    else
       next();
}
// sever side validation
module.exports.validateReview = (req,res,next) => {
    // req sent from hopscoch with empty body
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        throw new ExpressError(400, error); 
    }
    else
       next();
}