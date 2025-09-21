const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signupUser = async (req, res, next) => {
    let { username, password, email } = req.body;
    const newUser = new User({
        username: username,
        email: email
    });

    let registeredUser = await User.register(newUser, password);
    req.logIn(registeredUser, (err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "Welcome to wanderlust");
        res.redirect("/listings");
    });

};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.loginUser = (req, res) => {
    req.flash("success", "Welcome to wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings" ;
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "Logged out successfully");
        res.redirect("/listings");
    });
};