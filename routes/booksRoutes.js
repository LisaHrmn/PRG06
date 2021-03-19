let express = require('express');

let Book = require('../models/bookModel');

let routes = function(){

    let booksRouter = express.Router();

    booksRouter.use('/books/', function (req, res, next){
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")
        res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT")
        next()
    })
    ;

    booksRouter.use('/books/', function (req, res, next){
        console.log("middelware for collection")
        let acceptType = req.get("Accept")
        console.log("Accept:" + acceptType)
        if((acceptType == "application/json") || (req.method == "OPTIONS")){
            next()
        } else{
            res.status(400).send();
        }
    })
    ;
    
    booksRouter.route('/books')

        .post(function(req, res){
            let book = new Book(req.body);

            if (!req.body.title || !req.body.author || !req.body.summary) {
                res.sendStatus(400)
            } 
            else {
                book.save(function (err) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.status(201).send(book);
                    }
                });
            }
        })

        .get(function(req, res){
            Book.find({}, function(err, books){
                if(err){
                    res.status(500).send(err);
                }
                else{
                    let booksCollection = {
                        "items" : [],
                        "_links" : {
                            "self" : { "href": "http://" + req.headers.host + "/api/books" },
                            "collection" : { "href": "http://" + req.headers.host + "/api/books" }
                        },
                        "pagination" : {"message" : "to do"}
                    }
                    for(let book of books){
                        let bookItem = book.toJSON()

                        bookItem._links = {
                            "self" : { "href": "http://" + req.headers.host + "/api/books/" + bookItem._id },
                            "collection" : { "href": "http://" + req.headers.host + "/api/books" }
                        }

                        booksCollection.items.push(bookItem)
                    }

                    res.json(booksCollection);
                }
            })
        })
                
        .options(function(req, res){
            res.header("Allow", "POST,GET,OPTIONS").send()
        })
        ;

        booksRouter.route('/books/:bookId')

        .get(async(req, res) =>{
            try{
                const book = await Book.findById(req.params.bookId);
                let bookItem = book.toJSON();

                bookItem._links = {
                    "self" : { "href": "http://" + req.headers.host + "/api/books/" + bookItem._id },
                    "collection" : { "href": "http://" + req.headers.host + "/api/books" }
                }

                res.json(bookItem);
            } catch (err){
                res.status(404).send(err);
            }
        })
        
        .delete(async(req, res) =>{
            const book = await Book.findById(req.params.bookId);
            book.deleteOne(function (err) {
                if (err)
                    res.status(404).send(err);
                else {
                    res.status(204).send();
                }
            });
        })
        
        .put(function (req, res) {
            Book.findById(req.params.bookId, function (err, book) {
                if (!req.body.title || !req.body.author || !req.body.summary) {
                    res.sendStatus(400)
                    return
                } else {
                    book.title = req.body.title
                    book.author = req.body.author
                    book.summary = req.body.summary
    
                    book.save(function (err) {
                        if (err)
                            res.status(500).send(err)
                        else {
                            res.json(req.book)
                        }
                    });
                };
            });
        })
        
        .options(function(req, res){
            res.header("Allow", "GET,DELETE,PUT,OPTIONS").send()
        })
        ;

    return booksRouter;
};

module.exports = routes;