//jshint esversion:6
require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");

const app = express();
console.log(process.env.API_KEY);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});


secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });


const User = new mongoose.model('user', userSchema);


app.route('/')
    .get(function (req, res) {
        res.render("home");
    });


app.route('/login')
    .get(function (req, res) {
        res.render("login");
    })
    .post(function (req, res) {
        const username = req.body.username;
        const password = req.body.password;
        User.findOne({ email: username}, function (err, foundUser) {
            if (err) {
                console.log(err);
            }
            else {
                if (foundUser) {
                    if (foundUser.password === password) {
                        res.render('secrets');
                    }
                    else {
                        res.send('wrong password!');
                    }
                }
                else {
                    res.send('no such user!');
                }
            }
        })
    });

app.route('/register')
    .get(function (req, res) {
        res.render("register");
    })
    .post(function (req, res) {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });
        newUser.save(function (err) {
            if (err) {
                console.log(err);
            }
            else {
                res.render('secrets');
            }
        });
    });


app.listen(3000, function () {
    console.log("Server started on port 3000.")
});