var express = require('express');
var router = express.Router();
var fs = require('fs');
var jsdom = require('jsdom').jsdom;
var document = jsdom('<html></html>', {});
var window = document.defaultView;
var $ = require('jquery')(window);
var categorias = [];

/* GET home page. */
router.get('/', function(req, res, next) {
	fs.readFile(__dirname + '/../db/data.json', 'utf8', function(err, data){
		data = JSON.parse(data);
  		res.render('./catalogo/index', {title: "Bookstore", dados: data});
		res.end();
	});

});

module.exports = router;