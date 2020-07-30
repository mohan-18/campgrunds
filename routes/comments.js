var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var mongoose = require("mongoose");
router.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
    var id = mongoose.Types.ObjectId(req.params.id);
    Campground.findById(id, function (err, campground) {
        if (err)
            console.log(err);
        else
            res.render("comments/new", { campground: campground });
    });
});
router.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
    var id = mongoose.Types.ObjectId(req.params.id);
    Campground.findById(id, function (err, campground) {
        if (err) { console.log(err); redirect("/campgrounds"); }
        else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err)
                {
                    req.flash("error","Something went wrong");
                    console.log(err);
                }
                else {
                    // add username and id
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    })
});
//COMMENT EDIT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit",checkCommentOwnership,function (req,res) {
    Comment.findById(req.params.comment_id,function (err,foundComment) {
       if(err)
       {
           res.redirect("back");
       }
       else
       {
           res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
       }

    });

});
//COMMENT UPDATE ROUTE
router.put("/campgrounds/:id/comments/:comment_id",checkCommentOwnership,function (req,res) {

   Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function (err,updatedComment) {
      if(err)
          res.redirect("back");
      else
      {
          res.redirect("/campgrounds/"+req.params.id);
      }


   });
});
//COMMENT DESTROY ROUTE
router.delete("/campgrounds/:id/comments/:comment_id",checkCommentOwnership,function (req,res) {
    Comment.findByIdAndRemove(req.params.comment_id,function (err) {
        if(err)
            res.redirect("back");
        else
        {
            req.flash("success","Comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }


    })
});
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error","You need to be logged in to do so that!");
    res.redirect("/login");
}
function checkCommentOwnership(req,res,next){
    //if user is logged in or not
    if(req.isAuthenticated())
    {
        //if the user owns the campground or not
        Comment.findById(req.params.comment_id,function (err,foundComment) {
            if(err)
            {
                req.flash("error","Comment not found");
                res.redirect("back");
            }

            else
            {
                // console.log(foundCampground.author.id);
                // console.log(req.user._id);
                //does the user own the campground
                //foundCampground.author.id is string type and req.user._id is an object id
                //so we can't compare it
                if(foundComment.author.id.equals(req.user._id))
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