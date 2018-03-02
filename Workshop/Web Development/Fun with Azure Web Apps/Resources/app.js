
var express = require('express');
var routes = require('./routes');

var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var path = require('path');
app.use('/scripts', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'))); 
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
 
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

var comments = require('./routes/comments');
app.get('/comments', comments.comments);

//Create temporary storage items
var ratings = [
  {
    classId: 0,
    ratingCount: 0,
    ratingTotal: 0

  },
  {
    classId: 1,
    ratingCount: 0,
    ratingTotal: 0
  },
  {
    classId: 2,
    ratingCount: 0,
    ratingTotal: 0
  },
  {
    classId: 3,
    ratingCount: 0,
    ratingTotal: 0
  },
  {
    classId: 4,
    ratingCount: 0,
    ratingTotal: 0
  },
  {
    classId: 5,
    ratingCount: 0,
    ratingTotal: 0
  }
];

var commentCounts = [0, 0, 0, 0, 0, 0];
var classTitles = ['Deep Learning with Neural Networks', 'Advanced Calculus for Scholarship Athletes', 'Data Structures and Algorithms in Python', 'Orchestrating Big Data Using the Principles of Priority', 'Essential Mathematics for Artificial Intelligence Ethics', 'Statistical Inference in Post-Dimensional Social Analysis'];
var imageUrls = ['/img/stars0.png', '/img/stars0.png', '/img/stars0.png', '/img/stars0.png', '/img/stars0.png','/img/stars0.png'];

global.ratings = ratings;
global.comments = [];
global.commentCounts = commentCounts;
global.classTitles = classTitles;
global.imageUrls = imageUrls;

http.createServer(app).listen(app.get('port'), function(){   
  console.log('Express server listening on port ' + app.get('port'));
});
