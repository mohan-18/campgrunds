var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  methodOverride = require("method-override"),
  LocalStrategy = require("passport-local"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  flash = require("connect-flash"),
  seedDB = require("./seeds");

var commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  indexRoutes = require("./routes/index");

mongoose.connect(
  "mongodb+srv://Mohan:password08@cluster0.r2ncs.mongodb.net/campgrounds?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);
app.use(express.static(__dirname + "/public"));
// seedDB();

// Campground.create({
//     name: "Mario",
//     image: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/MarioNSMBUDeluxe.png/220px-MarioNSMBUDeluxe.png",

// }, function (err, campground) {
//     if (err)
//         console.log(err);
//     else {
//         console.log("Newly created campground", campground);
//     }
// });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
// PASSPORT CONFIGURATION---------------
app.use(
  require("express-session")({
    secret: "Once again Rusty wins cutest dog",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// -----------------------------------------
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
}); //pass currentUser to every routes

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);
app.set("view engine", "ejs");
console.log("hello");

app.listen(3000, () => console.log("Server running at port 3000"));
