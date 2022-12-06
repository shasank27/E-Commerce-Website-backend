const mongoose = require('mongoose');
const crypto = require('node:crypto');
const { v1: uuidv1 } = require('uuid');

const userSchema = mongoose.Schema({
    name : {
        type : String,
        trim: true,
        required: true,
        maxlength: 32
    },
    lastname : {
        type : String,
        trim: true,
        required: true,
        maxlength: 32
    },
    email : {
        type : String,
        trim: true,
        required: true,
        unique: true
    },
    userinfo : String,
    encry_password: {
        type: String,
        required: true
    },
    salt: String,
    role :{
        type: Number,
        default: 0
    },
    purchases : {
        type: Array,
        default:[]
    }
},{
    timestamps : true
})

//since encry_password is a required field it would throw error, so we set the encry_password via virtual field password which isn't saved into the database
userSchema.virtual('password')
    .set(function(password){
        this._password = password
        this.salt = uuidv1(); //salt is something we add to make hashing more secure 
        this.encry_password = this.securePassword(password)
    })
    .get(function(){
        return this._password;
    })

userSchema.methods = {
    authenticate : function(plainPassword){
        return this.securePassword(plainPassword) === this.encry_password;
    },
    securePassword: function(plainPassword){
        if(!plainPassword) return "";
        try {
            return crypto.createHmac('sha256', this.salt)
            .update(plainPassword)
            .digest('hex');
        } catch (err) {
            return "";
        }
    }
}

module.exports = mongoose.model('User', userSchema);