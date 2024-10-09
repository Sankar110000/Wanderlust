const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listings.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const router = express.Router();
const flash = require("connect-flash");
const user = require("../models/user.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const ExpressError = require("../utils/ExpressError.js");
const upload = multer({ storage });


router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[imageUrl]"),
    wrapAsync(listingController.createListing)
  );

router.route("/new").get(isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))
  .patch(isLoggedIn, isOwner, upload.single("listing[imageUrl]"), wrapAsync(listingController.updateListing));

router
  .route("/edit/:id")
  .get(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
  );

router
  .route("/search")
  .post(wrapAsync(listingController.renderSearchedListing));


module.exports = router;
