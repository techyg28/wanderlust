const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    // username and password will be added by default with salt and hash code.
    email : {
        type : String,
        required : true,
        max : 5,
    },
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);