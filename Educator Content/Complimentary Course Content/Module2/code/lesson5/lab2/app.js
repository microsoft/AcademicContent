var express = require('express'),
  bodyParser = require('body-parser'),
  logger = require('morgan')

let posts = require('./posts.json')

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(logger('dev'))


app.get('/', function(req, res, next) {
  res.send('please select a collection, e.g., /posts')
})

app.get('/api/posts', function(req, res, next) {
  let results = posts
  res.send(results)
})

app.post('/api/posts', function(req, res, next) {
  let post = req.body
  post.id = posts.length
  posts.push(post)
  res.send(post)
})

app.get('/api/posts/:id', function(req, res, next) {
  let result = posts.find((post)=>{
    return post.id == req.params.id
  })
  res.send(result)
})

app.put('/api/posts/:id', function(req, res, next) {
  let postIndex = posts.findIndex((post)=>{
    // console.log(req.params.id, post.id,req.body.id);
    return (post.id == req.params.id && post.id == req.body.id)
  })
  if (postIndex == -1) return next(new Error('Post not found'))
  posts[postIndex] = req.body
  res.send({msg:'success'})
})

app.delete('/api/posts/:id', function(req, res, next) {
  let postIndex = posts.findIndex((post)=>{
    return (post.id == req.params.id && post.id == req.body.id)
  })
  let result = posts.splice(postIndex, 1)
  res.send((result.length == 1)?{msg: 'success'} : {msg: 'error'})
})

if (require.main === module) {
  app.listen(3000, function(){
    console.log('Express server listening on port 3000')
  })
} else {
  module.exports = app
}

