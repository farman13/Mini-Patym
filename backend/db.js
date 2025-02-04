const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 30
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 4
    }
})

const accountSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        require: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const userModel = mongoose.model('users', userSchema);
const accountModel = mongoose.model('accounts', accountSchema);

module.exports = {
    userModel,
    accountModel
}