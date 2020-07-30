var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var data = [
    { name: "Disha Patani", image: "https://pbs.twimg.com/profile_images/928946397436506113/6QE6iLb7_400x400.jpg" },
    { name: "Kriti Kharbanda", image: "https://indianewengland.com/wp-content/uploads/2018/09/Kriti-Kharbanda.jpg" },
    { name: "Rakul Preet Singh", image: "https://images.ganeshaspeaks.com/OtherImages/Rakul-750-min.jpg" }
]
function seedDB() {
    Campground.remove({}, function (err) {
        if (err)
            console.log(err);
        else {
            console.log("removed campgrounds");
            data.forEach(function (seed) {
                Campground.create(seed, function (err, campground) {
                    if (err)
                        console.log(err);
                    else {
                        console.log("Successfully added");
                        Comment.create(
                            {
                                text: "This is great",
                                author: "Beautiful"
                            }, function (err, comment) {
                                if (err) console.log(err);
                                else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            }
                        )
                    }
                })
            })
        }
    });
}
module.exports = seedDB;