const Listing = require("./models/listings.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.joi.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("failure", "Please login first");
        res.redirect("/login");
    }else{
        next();
    }
}

module.exports.saveRedirectUrl = (req, res, next) => {
    res.locals.redirectUrl = req.session.redirectUrl;
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals( res.locals.user._id)){
        req.flash("failure", "Only the owner can edit the listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = function (req, res, next) {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
} 

module.exports.validateReview = function (req, res, next) {
    let { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map(el => el.message).join(" ,")
        throw new ExpressError(400, errMsg)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(req.user._id)){
        req.flash("failure", "You are not the author of this review");
        return res.redirect(`/listings/${id}`); 
    }
    next();
}