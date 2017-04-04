var express = require('express');
var router = express.Router();
var fs = require('fs');
var file = require('./../controller/file');
var jsdom = require('jsdom').jsdom;
var document = jsdom('<html></html>', {});
var window = document.defaultView;
var $ = require('jquery')(window);

router.get('/', function(req, res, next) {
	file.readDesejos(function(data){
		res.json(data);
	});
});

module.exports = router;