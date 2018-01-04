const mongoose = require('mongoose'),
      crypto= require('crypto'),
      Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id : {
    type : String,
    trim : true,
    required : 'User ID is required'
  },
  username : {
    type : String,
    trim : true,
    required : true
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
  salt : {
    type : String
  },
  grade : {
    type : Number
  },
  createdAt : {
    type : Date,
    default : Date.now
  }
}, {versionKey: false});

UserSchema.pre('save', function(next){
  if(this.password){
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});

UserSchema.methods.hashPassword = function(password){
  return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64');
};

UserSchema.methods.authenticate = function(password){
  return this.password === this.hashPassword(password);
};

mongoose.model('User', UserSchema);
