var express = require('express');
var router = express.Router();
var fs = require('fs');
var file = require('./../controller/file');

/* GET home page. */
router.get('/', function(req, res, next) {
	file.read(function(data){
		res.json(data);
	});
});

module.exports = router;