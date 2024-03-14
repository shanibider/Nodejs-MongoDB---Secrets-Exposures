//jshint esversion:6
/*
To create a new project, i need to install the following packages, and create a package.json file
npm init -y
npm i express body-parser ejs moongose

i will use the lowest level of security- email and password, using moonsgoose and mongoDB
*/

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const mongoose = require("mongoose");
/*
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
*/

const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


// mongoose connection
// for connection to this server we run on terminal: mongod, ctrl+c to stop, and nodemon app.js 
// localhost connection: connecting to a MongoDB server running on the localhost (the same machine where the code is executing) on the default MongoDB port (27017), and the name of the database being accessed is "userDB".
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});


// MongoDB server connection:
//mongoose.connect("mongodb://<username>:<password>@<remote_host>:<port>/<database_name>", {useNewUrlParser: true});


//****//
// user DB
const userSchema = {
  email: String,
  password: String
};

const User = new mongoose.model("User", userSchema);        // now we have a collection called users, and we can start adding users


app.get ("/", function (req,res){
    res.render("home");
});




// GET route for rendering the "secrets" page
app.get("/secrets", function(req, res) {
    res.render("secrets"); // Assuming "secrets.ejs" is the filename of the view template
  });
  


// GET route for rendering the login page
app.get("/login", function(req, res) {
    res.render("login"); // Assuming "login.ejs" is the filename of the view template
  });
  
  
  
// POST route for handling login form submission
app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
  
    // Find a user with the provided username in the database
    User.findOne({ email: username })
      .then(foundUser => {
        if (foundUser) {
          // If a user with the provided username is found, check if the password matches
          if (foundUser.password === password) {
            // If login is successful, redirect the user to another page
            res.redirect("/secrets"); // Assuming "/secrets" is the page where you want to redirect after successful login
          } else {
            // If the password does not match, render the login page with an error message
            res.render("login", { error: "Invalid password. Please try again." });
          }
        } else {
          // If no user with the provided username is found, render the login page with an error message
          res.render("login", { error: "User not found. Please register." });
        }
      })
      .catch(err => {
        // If there's an error, log it to the console and render the login page with an error message
        console.log(err);
        res.render("login", { error: "Something went wrong. Please try again later." });
      });
  });

  


app.get ("/register", function (req,res){
    res.render("register");
});



//catch POST request from ejs, and create new user based on the email and password entered
app.post ("/register", function (req,res){

    const newUser = new User({          // use User model to create a new user
        email: req.body.username,
        password: req.body.password
    });

    newUser.save()
        .then(() => {
            // If user is successfully saved, redirect to the secrets page
            res.render("secrets");
        })
        .catch(err => {
            // If there's an error, log it to the console
            console.log(err);
            // Optionally, you can send an error response to the client
            res.status(500).send("Error registering user.");
        });
});




// GET route for rendering the "submit" page
app.get("/submit", function(req, res) {
    res.render("submit"); // Assuming "submit.ejs" is the filename of the view template
  });
  
  // POST route for handling form submission
  app.post("/submit", function(req, res) {
    const submittedSecret = req.body.secret; // Get the submitted secret from the form
  
    // Here you can do whatever you want with the submitted secret, such as saving it to the database
  
    // After handling the submission, you can redirect the user to another page
    res.redirect("/secrets"); // Assuming "/secrets" is the page where you want to redirect after submitting the secret
  });

  



app.listen(3000, function (){
    console.log("Server started on port 3000.");
});