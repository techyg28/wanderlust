const Listening = require("../models/listing.js");

module.exports.index = async (req,res)=>{
    const allListings = await Listening.find({});
    res.render("listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req, res)=>{
    res.render("listings/new.ejs");
}

module.exports.createListing = async (req,res,next)=>{
    let url=req.file.path;
    let filename = req.file.filename;
    let newListing = new Listening(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}

module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listening.findById(id)
    .populate({path :"reviews",
        populate : {path :"author"}}
    )
    .populate("owner");
    // if listing doesn't exists - throws error phase 2 part c flash failure
    if(!listing) {
        req.flash("error","Listing you requested for doesn't exist!");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs",{listing});
}

module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listening.findById(id);
    if(!listing) {
        req.flash("error","Listing you requested for doesn't exist!");
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/uploads","/uploads/h_300,w_250");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing = async (req, res)=>{
    let {id} = req.params;
    let listing=await Listening.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file != "undefined") {
    let url=req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save(); 
    }
    req.flash("success","Listing Edited!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res)=>{
    let {id} = req.params;
    let del=await Listening.findByIdAndDelete(id, {...req.body.params});
    // console.log(del);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}