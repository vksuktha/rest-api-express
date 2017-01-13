var express = require('express'),
	mongoskin = require('mongoskin'),
	bodyParser = require('body-parser')
	logger = require('morgan')


var app = express()
app.use(bodyParser.json())
app.use(logger('dev'))

var db = mongoskin.db('mongodb://@localhost:27017/test', {safe: true})

app.param('collectionName', function(re3q, res,next,collectionName){
	req.collection = db.collection(collectionName);
	return next();
	})

app.get('/', function(req, res, next) {
	res.send('please select a collectionName');
})

app.get('/collections/:collectionName', function( req, res, next) {
	req.collection.find({}, {limit: 10, sort: {'_id': 1}}).toArray(function (e, result) {
		if (e) return next(e)
			req.send(result);
	})
})

app.post('/collections/:collectionName', function( req, resp,next) {
	req.collection.insert(req.body, {}, function(e, result){
		if (e) return ( next(e))
			res.send(result);
	})
})

app.get('collections/:collectionName/:id', function(req, res, next) {
	req.collection.findById(req.params.id, function(e, result){
		if (e) return next (e)
			res.send(result);
	})
})

app.put('collection/:collection/:id', function(req,res,next){
	req.collection.updateById(req.params.id, function( e, result){
		if (e) next (e)
			res.send(result);
	})
})

app.delete('collection/:collection/:id', function(req, res, next) {
	req.collection.removeById(req.params.id, function( e, result){
		if (e) next(e)
			res.send(result);
		})
})

app.listen(3000, function(){
	console.log('Express server listening on port 3000')
})