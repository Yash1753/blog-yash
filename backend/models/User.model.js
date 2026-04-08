import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type: String,
        required : true,
        trim : true,
        unique : true,
        lowercase : true,
        index : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum: ["admin", "moderator", "viewer"],
        default: "viewer",
    }
},{
    timestamps: true
});


export const User = mongoose.model("User", userSchema);