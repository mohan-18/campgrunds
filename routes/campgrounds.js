var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var mongoose = require("mongoose");
router.get("/campgrounds", function (req, res) {
    Campground.find({}, function (err, campgrounds) {
        if (err)
            console.log(err);
        else
            res.render("campgrounds/index", { campgrounds: campgrounds, currentUser: req.user });
    });

});
//CREATE - add new campground to DB
router.post("/campgrounds",isLoggedIn,function (req, res) {
    //get data from form
    var name = req.body.Name;
    var image = req.body.Image;
    var price=req.body.Price;
    // console.log(price);
    var author={
        id:req.user._id,
        username:req.user.username
    };
    var newCampground = { name: name,price: price,image: image,author:author};
    // console.log("This is the user",req.user);
    Campground.create(newCampground,function (err, newlyCreated) {
        if (err)
            console.log(err);
        else {
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }

    })
});
router.get("/campgrounds/new", isLoggedIn,function (req, res) {
    res.render("campgrounds/new");
});
router.get("/campgrounds/:id", function (req, res) {
    var id = mongoose.Types.ObjectId(req.params.id);
    Campground.findById(id).populate("comments").exec(function (err, comments) {
        if (err)
            console.log(err);
        else {
            res.render("campgrounds/show", { campground: comments });
        }
    });
});
//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit",checkCampgroundOwnership,function (req,res) {

        Campground.findById(req.params.id,function (err,foundCampground) {
                    res.render("campgrounds/edit",{campground:foundCampground});
        });

});
//UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id",checkCampgroundOwnership,function (req,res) {

    // console.log(req.body.campground);
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function (err,updatedCampground) {
        if(err)
            res.redirect("/campground");
        else
        {
            // console.log(updatedCampground);
            req.flash("success","Campground successfully updated");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });

});
//DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id",checkCampgroundOwnership,function (req,res) {
    Campground.findByIdAndRemove(req.params.id,function (err) {
        if(err)
            res.redirect("/campgrounds");
        else
        {
            req.flash("success","Campground successfully deleted");
            res.redirect("/campgrounds");
        }



    })

});
//check is the user is logged in or not
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error","You need to be logged in to do so that!");
    res.redirect("/login");
}
function checkCampgroundOwnership(req,res,next){
    //if user is logged in or not
    if(req.isAuthenticated())
    {
        //if the user owns the campground or not
        Campground.findById(req.params.id,function (err,foundCampground) {
            if(err)
            {
                req.flash("error","Campground not found");
                res.redirect("back");
            }

            else
            {
                // console.log(foundCampground.author.id);
                // console.log(req.user._id);
                //does the user own the campground
                //foundCampground.author.id is string type and req.user._id is an object id
                //so we can't compare it
                if(foundCampground.author.id.equals(req.user._id))
                   next();
                else{
                    req.flash("error","You don't have the permission to do that");
                    res.redirect("back");
                }

            }
        });
    }
    else
    {
        req.flash("error","You need to be logged in to do that!");
        res.redirect("back");
    }



}
module.exports = router;