const { models } = require("mongoose");
const Listing = require("../models/listings.js");
const ExpressError = require("../utils/ExpressError.js");

module.exports.index = async (req, res) => {
  const listings = await Listing.find();
  res.render("listings/index.ejs", { listings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  let filename = req.file.filename;
  let url = req.file.path;
  let { title, description, price, location, country } = req.body.listing;
  let listing = new Listing({
    title: title,
    description: description,
    price: price,
    location: location,
    country: country,
    owner: req.user.id,
  });
  listing.image = { url, filename };
  let savedListing = await listing.save();
  req.flash("success", "Listing created successfully");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id).populate({
    path: "reviews",
    populate: { path: "author" },
  });
  res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_200");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndDelete(id);
  req.flash("failure", "Listing deleted successfully");
  res.redirect("/listings");
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing);
  if (typeof req.file != "undefined") {
    let filename = req.file.filename;
    let url = req.file.path;
    updatedListing.image = { url, filename };
    let newListing = await Listing.findByIdAndUpdate(id, updatedListing);
  }
  res.redirect(`/listings/${id}`);
};

module.exports.renderSearchedListing = async (req, res, next) => {
  let {searchedListing} = req.body;
  let listing = await Listing.findOne({title: searchedListing}).populate({
    path: "reviews",
    populate: {path: "author"}
  });
  if(listing){
    res.render("listings/show.ejs", {listing});
  }else{
    throw new ExpressError(404, "No such listing found");
  }
};
