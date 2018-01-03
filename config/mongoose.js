var config = require('./config'),
  mongoose = require('mongoose');

  module.exports = function(){
    mongoose.Promise = global.Promise;
    var db = mongoose.connect(config.db, {
      useMongoClient: true
    },
    err => console.log(err ? err : 'MongoDB connected');
  );

    require('../app/models/user.server.model.js');
    return db;
  }
