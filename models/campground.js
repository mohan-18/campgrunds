var mongoose = require("mongoose");
var comment = require("./comment");
var campgroundSchema = new mongoose.Schema({
    name: String,
    price:String,
    image: String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String

    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});
module.exports = mongoose.model("Campgroundv12", campgroundSchema);