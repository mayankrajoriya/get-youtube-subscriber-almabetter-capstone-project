const jwt=require("jsonwebtoken");

const generateToken=(user)=>{
    return jwt.sign({email:user.email,id:user._id},"uniqueKey")
}


module.exports.generateToken=generateToken