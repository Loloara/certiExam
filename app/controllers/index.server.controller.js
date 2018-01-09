exports.render = function(req,res){
  res.render('index', {
    title : 'certiExam',
    user : req.user ? req.user : ''
  });
};
