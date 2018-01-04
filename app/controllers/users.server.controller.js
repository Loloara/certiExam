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

exports.renderSignin = function(req, res){
  if(!req.user){
    res.render('signin',{
      title : 'Sign-in Form',
      messages : req.flash('error') || req.flash('info')
    });
  }else{
    res.redirect('/');
  }
};

exports.renderSignup = function(req, res){
  if(!req.user){
    res.render('signup', {
      title : 'Sign-up Form',
      messages : req.flash('error')
    });
  }else{
    res.redirect('/');
  }
};

exports.renderEdit = function(req, res){
  if(req.user){
    res.render('edit', {
      title : 'Edit Form',
      messages : req.flash('error')
    });
  }else{
    res.redirect('/');
  }
};

exports.renderLeave = function(req, res){
  if(req.user){
    res.render('leave', {
      title : 'Leave Form',
      messages : req.flash('error')
    });
  }else{
    res.redirect('/');
  }
};

exports.signup = function(req, res){
  if(!req.user){
    const user = new User(req.body);
    user.grade = 1;

    let message = null;

    user.save(function(err){
      if(err){
        message = getErrorMessage(err);

        req.flash('error', message);
        res.redirect('/signup');
      }else{
        console.log('save');
        req.login(user, function(err){
          if(err){
              res.json({
                "result" : "ERROR",
                "code" : err.code,
                "message" : err
              });
          }
          res.redirect('/');
        });
      }
    });
  }else{
    res.redirect('/');
  }
};

exports.editUser = function(req, res){
  if(!req.user){
    res.redirect('/');
  }else{
    req.user.username = req.body.username;
    req.user.password = req.body.password;
    let message = null;

    req.user.save(function(err){
      if(err){
        message = getErrorMessage(err);
        req.flash('error', message);
        res.redirect('/edit');
      }else{
        req.login(req.user, function(err){
          if(err){
              res.json({
                "result" : "ERROR",
                "code" : err.code,
                "message" : err
              });
          }
          res.redirect('/');
        });
      }
    });
  }
}

exports.leave = function(req, res){
  if(!req.user){
    res.redirect('/');
  }else{
    req.user.remove(function(err){
      if(err){
        res.json({
          "result" : "ERROR",
          "code" : err.code,
          "message" : err
        });
      }else{
        res.redirect('/');
      }
    });
  }
}

exports.signout = function(req,res){
  req.logout();
  res.redirect('/');
};
