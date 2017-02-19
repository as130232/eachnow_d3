
var mongoose = require("mongoose");
mongoose.Promise = require('bluebird');
console.log();
//var dbURI = "mongodb://charles:charles@ds117869.mlab.com:17869/eachnow_d3";

var localDb = 'mongodb://localhost:27017/eachnow';

mongoose.connect(localDb);



console.log(mongoose);


//create schema

