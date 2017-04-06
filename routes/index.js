var express = require('express');
var router = express.Router();
var fs = require('fs');
var file = require('./../controller/file');
// jquery
var jsdom = require('jsdom').jsdom;
var document = jsdom('<html></html>', {});
var window = document.defaultView;
var $ = require('jquery')(window);
var categorias = [];

/* GET home page. */
router.get('/', function(req, res, next) {
	file.read(function(data){
		$.each(data.produtos, function(index, value) {
		    if ($.inArray(value.categoria, categorias)==-1) {
		        categorias.push(value.categoria, value.capa);
		    }
		});
  		res.render('index', {title: "Bookstore", categorias: categorias});
		res.end();
	});

});

module.exports = router;
