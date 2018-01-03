exports.render = function(req,res){
  res.render('index', {
    title : 'certiExam',
    username : req.user ? req.user.username : ''
  });
};
