    /* **************************************************************
                    Student Name: Bal Krishna Dhakal
                    Student ID: 300916314
                    Description: COMP308-W2019 Midterm Test
                    Date Created: 23rd Feb, 2019 
                    Link to GitHub: https://github.com/BalKrishnaDhakal/COMP308-W2019-Midterm-300916314
                    Link to Heroku: https://comp308-w2019-midterm-30091631.herokuapp.com/
                    
                    *****************************************************/


    // modules required for routing
    let express = require('express');
    let router = express.Router();
    let mongoose = require('mongoose');
    let passport = require('passport');

    // define the book model
    let book = require('../models/books');

    //-------------------
    function requiredAuth(req, res, next) {
        //checking if the user is logged in
        if (!req.isAuthenticated()) {
            return res.redirect('/login');
        }
        next();
    }

    /* GET books List page. READ */

    router.get('/', requiredAuth, (req, res, next) => {
        // find all books in the books collection
        book.find((err, books) => {
            if (err) {
                return console.error(err);
            } else {
                res.render('books/index', {
                    title: 'Books',
                    books: books,
                    displayName: req.user ? req.user.displayName : ''
                });
            }
        });

    });

    //  GET the Book Details page in order to add a new Book
    router.get('/add', (req, res, next) => {

        /*****************
         * ADD CODE HERE *
         *****************/
        res.render('books/details', {
            title: 'Add New Books',
            books: '',
            displayName: req.user ? req.user.displayName : ''
        });

    });



    // POST process the Book Details page and create a new Book - CREATE
    router.post('/add', (req, res, next) => {

        /*****************
         * ADD CODE HERE *
         *****************/
        let newBook = book({
            "Title": req.body.title,
            "Price": req.body.price,
            "Author": req.body.author,
            "Genre": req.body.genre
        });
        book.create(newBook, (err, book) => {
            if (err) {
                console.log(err);
                res.end();
            } else {
                // Refresh the book list
                res.redirect('/books');
            }
        });

    });

    // GET the Book Details page in order to edit an existing Book
    router.get('/:id', (req, res, next) => {

        /*****************
         * ADD CODE HERE *
         *****************/
        let id = req.params.id;
        book.findById(id, (err, bookObject) => {
            if (err) {
                console.log(err);
                res.end(err);
            } else {
                // show the details of edit or delete results
                res.render('books/details', {
                    title: 'Edit Details Book',
                    books: bookObject,
                    displayName: req.user ? req.user.displayName : ''
                });
            }
        });
    });

    // POST - process the information passed from the details form and update the document
    router.post('/:id', (req, res, next) => {

        /*****************
         * ADD CODE HERE *
         *****************/
        let id = req.params.id;
        let newBook = book({
            "_id": id,
            "Title": req.body.title,
            "Price": req.body.price,
            "Author": req.body.author,
            "Genre": req.body.genre
        });
        book.update({ _id: id }, newBook, (err) => {
            if (err) {
                console.log(err);
                res.end(err);
            } else {
                // Refresh favourite books-list
                res.redirect('/books')
            }
        });

    });

    // GET - process the delete by user id
    router.get('/delete/:id', (req, res, next) => {

        /*****************
         * ADD CODE HERE *
         *****************/
        let id = req.params.id;
        //deleting methods 
        book.remove({ _id: id }, (err) => {

            if (err) {
                console.log(err);
                res.end(err);
            } else {
                //Refresh Favvourite List
                res.redirect('/books');

            }

        });
    });



    module.exports = router;