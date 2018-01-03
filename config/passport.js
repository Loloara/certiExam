const passport = require('passport'),
      mongoose = require('mongoose');

module.exports = function(){
  const User = mongoose.model('User');

  passport.serializeUser(function(user, done){
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, '-password -salt', function(err, user){
      done(err, user);
    });
  });
  require('./strategies/local.js')(passport);
};
