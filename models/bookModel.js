let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//Strings only :)
let bookModel = new Schema(
    {
        title: { type: String },
        author: { type: String },
        summary: { type: String },
    }
);

module.exports = mongoose.model('Book', bookModel);
