require('dotenv').config();
const express = require('express')
const ejs = require("ejs");
const path = require("path");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const listing = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const user = require("./routes/user.js");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const ExpressError = require("./utils/ExpressError.js");

const dbUrl = process.env.ATLASDB_URL;
let secret = process.env.SECRET;

const app = express();
const port = 8080 || 3000 || 5000;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret
    },
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.log("Error on Mongostore: ", err);
})

const sessionOptions = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}



app.set('views', path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "static")));

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use("/", (req, res, next) => {
    res.locals.success_msg = req.flash("success");
    res.locals.delete_msg = req.flash("failure");
    res.locals.user = req.user;
    next();
});

app.use("/listings", listing);
app.use("/listings/:id/reviews", reviews);
app.use("/", user);

app.engine("ejs", ejsMate);

// For all invalid  routes
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error.ejs", { status, message });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});