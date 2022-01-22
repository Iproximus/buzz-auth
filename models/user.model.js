const mongoose = require('mongoose');
const User = new mongoose.Schema({
    username: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false

    },
    phnumber: {
        type: Number,
        required: false
    },
    password: {
        type: String,
        required: false
    }
})

// function validateUser(user) {
//     const schema = {
//         name: Joi.string().min(5).max(50).required(),
//         email: Joi.string().min(5).max(255).required().email(),
//         phnumber: Joi.string().min(10).max(10).required(),
//         password: Joi.string().min(5).max(255).required()
//     };

// }

module.exports = mongoose.model('register', User)