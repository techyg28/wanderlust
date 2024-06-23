const Listening = require("../models/listing.js"); 
const Review = require("../models/review.js");

module.exports.createReview = async (req, res)=>{
    let listing = await Listening.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review added successfully!");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req, res)=>{
    let {id, reviewId} = req.params;
    // Deleting from listing schema
    await Listening.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    // Deleting from  review schema
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted successfully!");
    res.redirect(`/listings/${id}`);
}