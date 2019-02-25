    /* *********************************
                Student Name: Bal Krishna Dhakal
                Student ID: 300916314
                Description: COMP308-W2019 Midterm Test
                Date Created: 23rd Feb, 2019 
                Link to GitHub: https://github.com/BalKrishnaDhakal/COMP308-W2019-Midterm-300916314
               Link to Heroku: https://comp308-w2019-midterm-30091631.herokuapp.com/
                    
                ************************************/
    // modules required for routing
    let express = require('express');
    let router = express.Router();
    let mongoose = require('mongoose');
    let passport = require('passport'); // for auth

    // define the game model
    let book = require('../models/books');

    // Reference to user model...
    let userModel = require('../models/user');
    let User = userModel.User; // this is alias for user model


    /* GET home page. wildcard */
    router.get('/', (req, res, next) => {
        res.render('content/index', {
            title: 'Home',
            books: ''
        });
    });


    /* GET -- display the login pag */
    router.get('/login', (req, res, next) => {

        //checking if user is login
        if (!req.user) {
            res.render('auth/login', {
                title: "Login",
                messages: req.flash('loginMessage'),
                displayName: req.user ? req.user.displayName : ''
            });

        } else {
            return res.redirect('/')
        }
    });


    /* GET --- processing the login pag */
    router.post('/login', (req, res, next) => {

        passport.authenticate('local',
            (err, user, info) => {
                // server error?
                if (err) {
                    return next(err);
                }
                // if user login error?
                if (!user) {
                    req.flash("loginMessage", "Login Error");
                    return res.redirect('/login');
                }
                req.logIn(user, (err) => {
                    // server error?
                    if (err) {
                        return next(err);
                    }
                    return res.redirect('/books');
                });
            })(req, res, next);
    });

    /* GET--display the user Registration page */
    router.get('/register', (req, res, next) => {
        //checking 
        if (!req.user) {
            res.render('auth/register', {
                title: "Register",
                messages: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName : ''
            });

        } else {
            return res.redirect('/')
        }
    });


    /* GET --- Processes the user Registration page */
    router.post('/register', (req, res, next) => {

        //created new user object

        let newUser = new User({
            username: req.body.username,
            //password: req.body.password
            email: req.body.email,
            displayName: req.body.displayName
        });

        User.register(newUser, req.body.password, (err) => {
            if (err) {
                console.log("Error: Inserting New User");
                if (err.name == "UserExistsError") {
                    req.flash(
                        "registerMessage",
                        "Registration Error: User Already Exists!"
                    );
                    console.log("Error: User Already Exists!");
                }
                return res.render("auth/register", {
                    title: "Register",
                    messages: req.flash("registerMessage"),
                    displayName: req.user ? req.user.displayName : ""
                });
            } else {
                // if no error exists, then registration is successful

                // redirect the user
                return passport.authenticate("local")(req, res, () => {
                    res.redirect("/books");
                });
            }
        });

    });
    //GET --- perform user logout 

    router.get('/logout', (req, res, next) => {
        req.logout();
        res.redirect("/");
    });



    module.exports = router;