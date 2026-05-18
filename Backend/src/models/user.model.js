const { default: mongoose } = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    user_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    bio:{
        type:String
    },
    profilePhoto:{
        type:String
    },
    resetOtp:Number,
    resetOtpExpiry:Date
});

userSchema.methods.hashedPassword = async function(password){
    return await bcrypt.hash(password, this.password);
}

userSchema.methods.findUserByEmail = async function(email){
    return await this.findOne({email});
}

userSchema.methods.generateJWT = function(){
    return jwt.sign({email: this.email}, process.env.JWT_SECRET, {expiresIn: '1h'})
}

const User = mongoose.model('User', userSchema);

module.exports = User;