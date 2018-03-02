
/*
 * GET home page.
 */

exports.index = function(req, res){
  
  res.render('index', {
    
    title: 'Classrates', classTitles: global.classTitles, imageUrls: global.imageUrls, comments: global.comments, commentCounts: global.commentCounts
  });
  
};
