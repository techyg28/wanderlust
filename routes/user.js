const express = require("express");
// Router divides the big code into smaller chuncks to make it more readable.
const router = express.Router(); // to merge parent route with child route.
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/users.js");

router
    .route("/signup")
    .get(userController.renderSignup)
    .post(wrapAsync(userController.signup));

router
    .route("/login")
    .get(userController.renderLogin)
    .post(
    saveRedirectUrl,
    passport.authenticate("local",
    {failureRedirect:'/login',failureFlash:true})
    ,wrapAsync(userController.login));

router.get("/logout",userController.logout);

module.exports =router;