const express =require("express");
const router=express.Router({mergeParams: true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");

const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview, isLoggedIn, isOwner, isReviewAuthor}=require("../middleware.js");
const { createReview } = require("../controller/review.js");



const reviewController=require("../controller/review.js");






//post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));


//delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;
