const User = require('mongoose').model('User'),
      passport = require('passport');

const getErrorMessage = function(err){
  let message = '';
  if(err.code){
    switch(err.code){
      case 11000:
      case 11001:
        message = 'UserID already exists';
        break;
      default:
        message = 'Something went Wrong';
    }
  }else{
    for(let errName in err.errors){
      if(err.errors[errName].message){
        message = err.errors[errName].message;
      }
    }
  }
  return message;
};

exports.renderSignin = function(req, res, next){
  if(!req.user){
    res.render('signin',{
      title : 'Sign-in Form',
      messages : req.flash('error') || req.flash('info')
    });
  }else{
    return res.redirect('/');
  }
};

exports.renderSignup = function(req, res, next){
  if(!req.user){
    res.render('signup', {
      title : 'Sign-up Form',
      messages : req.flash('error')
    });
  }else{
    return res.redirect('/');
  }
};

exports.signup = function(req, res, next){
  if(!req.user){
    const user = new User(req.body);
    let message = null;

    user.save(function(err){
      if(err){
        console.log(err);
        message = getErrorMessage(err);

        req.flash('error', message);
        return res.redirect('/signup');
      }
      console.log('save');
      req.login(user, function(err){
        if(err) return next(err);
        return res.redirect('/');
      });
    });
  }else{
    return res.redirect('/');
  }
};

exports.signout = function(req,res){
  req.logout();
  res.redirect('/');
};
