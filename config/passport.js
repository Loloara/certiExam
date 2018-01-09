const passport = require('passport'),
      mongoose = require('mongoose');

module.exports = function(){
  const User = mongoose.model('User');
  passport.serializeUser(function(user, done){
    user.recentLogin = Date.now();
    User.findByIdAndUpdate(user._id, user, function(err, _user){
      if(err) console.log('ERROR: passport.serializeUser');
    });
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, '-password -salt', function(err, user){
      done(err, user);
    });
  });
  require('./strategies/local.js')(passport);
};
