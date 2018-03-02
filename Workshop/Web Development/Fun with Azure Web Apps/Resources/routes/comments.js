/*
 * GET comments page.
 */

exports.comments = function (req, res) {

  var classId = req.query.classId;
  var comments = req.query.comments;

  if (comments != null) {
 
    var rating = req.query.rating;
    
    if (rating == 0) rating = 1;

    global.ratings[classId].ratingCount++;
    global.ratings[classId].ratingTotal = global.ratings[classId].ratingTotal + Math.round(rating);
    var comment = { classId: classId, rating: rating, comments: comments, createdDate: new Date().getDate() };
    global.comments.push(comment);

    var classComments = global.ratings.filter(function (value) { return value.classId == classId; })

    var averageRating = Math.round(global.ratings[classId].ratingTotal / global.ratings[classId].ratingCount);

    global.commentCounts[classId] = classComments[0].ratingCount;
    global.imageUrls[classId] = '/img/stars' + averageRating + '.png';

  }

  var classComments = global.comments.filter(function (value) { return value.classId == classId; })

  var averageRating = Math.round(global.ratings[classId].ratingTotal / global.ratings[classId].ratingCount);

  if (isNaN(averageRating)) averageRating = 0;

  classComments.sort(function (a, b) {
    var dateA = new Date(a.createdDate), dateB = new Date(b.createdDate)
    return dateA - dateB  
  })

  classComments.reverse();

  res.render('comments', { title: 'Classrates', classRating: averageRating,  classTitle: classTitles[classId], classComments: classComments });
};


