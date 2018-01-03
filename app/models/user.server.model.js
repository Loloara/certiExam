var mongoose = require('mongoose'),
    crypto= require('crypto'),
    Schema = mongoose.Schema;
var UserSchema = new Schema({
  username : {
    type : String,
    trim : true,
    required : true
  },
  userid : {
    type : String,
    trim : true,
    unique : true,
    required : 'User ID is required'
  },
  password : {
    type : String,
    validate : [
      function(password){
        return password.length >= 8;
      }, 'Password should be at least 8 characters'
    ],
    required : true
  },
  created : {
    type : Date,
    default : Date.now
  }
});

UserSchema.pre('save', function(next){
  if(this.password){
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});

UserSchema.methods.hashPassword = function(password){
  return crypto.pbkdf2Sync(password, this.salt, 10000,64,'sha512').toString('base64');
};

UserSchema.methods.authenticate = function(password){
  return this.password === this.hashPassword(password);
};

UserSchema.statics.findUniqueUserid = function(userid, suffix, callback){
  var _this = this;
  var possibleUserid = userid + (suffix || '');

  _this.findOne({
    userid : possibleUserid
  }, function(err, user){
    if(!err){
      if(!user){
        callback(possibleUserid);
      }else{
        return _this.findUniqueUserid(userid, (suffix || 0) + 1, callback);
      }
    }else{
      callback(null);
    }
  });
};

mongoose.model('User', UserSchema);
