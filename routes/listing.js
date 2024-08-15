const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");

const listingController=require("../controller/listing.js")

const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });



router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.create));

//new
router.get("/new",isLoggedIn, listingController.newform);



router.route("/:id")
.put(isLoggedIn,isOwner,upload.single("listing[image]"),wrapAsync(listingController.update))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.delete))
.get(wrapAsync(listingController.show));




//edit
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.edit));


//index route
// router.get("/",wrapAsync(listingController.index));

//create
// router.post("/",isLoggedIn,wrapAsync(listingController.create));

// //update
// router.put("/:id",isLoggedIn,isOwner,wrapAsync(listingController.update));

// //delete
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.delete));

// //show
// router.get("/:id",wrapAsync(listingController.show));


module.exports=router;
