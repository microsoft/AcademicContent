var express = require('express'),
  bodyParser = require('body-parser'),
  logger = require('morgan'),
  crypto = require('crypto')


let tableName = 'microblogdev'
let partitionKey = 'postsPartitionA'

var azure = require('azure-storage')

var tableSvc = azure.createTableService()
tableSvc.createTableIfNotExists(tableName, function(error, result, response){
  if(!error){
    console.log('Table exists or created', result)
  } else {
    console.log('Error creating table', error)
  }
})
var entGen = azure.TableUtilities.entityGenerator

var app = express()
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(logger('dev'))


app.get('/', function(req, res, next) {
  res.send('please select a collection, e.g., /posts')
})

app.get('/api/posts', function(req, res, next) {
  var query = new azure.TableQuery()
  .top(100)
  .where('PartitionKey eq ?', partitionKey)
  tableSvc.queryEntities(tableName, query, null, function(error, result, response) {
    if (error) return next(error)
    // query was successful
    // console.log(response, result)
    res.send(result.entries)
  })
})

app.post('/api/posts', function(req, res, next) {
  let id = `${req.body.author}${Date.now()}`
  // console.log(id)
  id = crypto.createHash('sha256').update(id).digest('hex')
  // console.log(id)
  var task = {
    PartitionKey: {'_':partitionKey},
    RowKey: {'_': id},
    author: {'_': req.body.author},
    text: {'_': req.body.text},
    createdAt: {'_': new Date(2015, 6, 20), '$':'Edm.DateTime'}
  }
  // console.log('before insert')
  tableSvc.insertEntity(tableName,
    task,
    {echoContent: true},
    function (error, result, response) {
      if (error) return next(error)
      // Entity inserted
      // console.log(result);
      res.send(result)
  })
})

app.get('/api/posts/:id', function(req, res, next) {
  tableSvc.retrieveEntity(tableName,
    partitionKey,
    req.params.id,
    function(error, result, response){
      if (error) return next(error)
      // result contains the entity
      res.send(result)
    }
  )
})

app.put('/api/posts/:id', function(req, res, next) {
  let updatedPost = {}
  if (req.body.author)
    updatedPost.author = {'_': req.body.author}
  if (req.body.text)
    updatedPost.text = {'_': req.body.text}
  updatedPost.PartitionKey = {'_': partitionKey}
  updatedPost.RowKey = {'_': req.params.id}
  tableSvc.replaceEntity(tableName, updatedPost, function(error, result, response){
    if (error) return next(error)
    // Entity updated
    console.log(result);
    res.send({msg:'success'})
  })
})

app.delete('/api/posts/:id', function(req, res, next) {
  let post = {}
  post.PartitionKey = {'_': partitionKey}
  post.RowKey = {'_': req.params.id}
  tableSvc.deleteEntity(tableName, post, function(error, response){
    if (error) return next(error)
    // console.log(response);
    // Entity deleted
    res.send({msg: 'success'})
  })
})
//
// tableSvc.deleteTable(tableName, function(error, response){
//     if(!error){
//         // Table deleted
//     }
// })
if (require.main === module) {
  app.listen(3000, function(){
    console.log('Express server listening on port 3000')
  })
} else {
  module.exports = app
}
