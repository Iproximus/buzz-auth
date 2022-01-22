// seperate the projcet nodejs (and) front end react "ok"
// integerate the project  "ok"
// copy of front end to react native //later


const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require("jsonwebtoken");
const auth = require('../middleware/auth');
require("dotenv").config();
const router = express.Router();

router.post('/register', async(req, res) => {
    try {
        let {
            username,
            email,
            phnumber,
            password
        } = req.body;

        if (!username || !email || !phnumber || !password)
            return res.status(400).json({ msg: "Not all fields have been entered." });

        if (password.length < 8)
            return res.status(400).json({ msg: "The password needs to be at least 8 characters long." });

        let existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ Error: 'That user already exisits!' });
        }

        //user = new User(_.pick(req.body, ['username', 'email', 'phnumber', 'password']));

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            email,
            phnumber,
            password: hashPassword
        });
        const savedUser = await newUser.save();
        res.json(savedUser);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ msg: "Not all fields have been entered." });

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Incorrect email or password.' });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        console.log("token", token);
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
            },
        });
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

router.post('/tokenIsValid', async(req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', auth, async(req, res) => {
    const user = await User.findById(req.user);
    res.json({
        username: user.username,
        id: user._id,
    });
});

module.exports = router;