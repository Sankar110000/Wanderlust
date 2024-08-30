const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const Review = require("../models/review.js");
const router = express.Router({ mergeParams: true});
const {validateReview} = require("../middleware.js");
const {isLoggedIn, isAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js"); 


// Review
// Create route
router.post("/", validateReview, isLoggedIn, wrapAsync(reviewController.createReview));

// Delete route
router.post("/:reviewId", isLoggedIn, isAuthor, reviewController.deleteReview);

module.exports = router;