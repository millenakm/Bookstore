var express = require('express');
var router = express.Router();
var fs = require('fs');
var file = require('./../controller/file');
var jsdom = require('jsdom').jsdom;
var document = jsdom('<html></html>', {});
var window = document.defaultView;
var $ = require('jquery')(window);

router.get('/', function(req, res, next) {
	var param = req.query;
	if(param.count=='carrinho'){
		file.readCarrinho(function(data){
			res.send(data);
		});
	}
	else if(param.count=='desejos'){
		file.readDesejos(function(data){
			res.send(data);
		});
	}
});

module.exports = router;