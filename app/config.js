var path = require('path');
var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '../db/shortly.sqlite')
  }
});
// var db = require('bookshelf')(knex);
exports.mongoose = mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shortly');

var db = mongoose.connection;

db.on('error', function (err) {
  console.log('connection error', err);
});
db.once('open', function () {
  console.log('connected.');


});


var Schema = mongoose.Schema;
exports.userSchema = userSchema = new Schema({
  username: String,
  password: String
}, {timestamps: true});

exports.linkSchema = linkSchema = new Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: {type: Number, default: 0}
}, {timestamps: true} );

