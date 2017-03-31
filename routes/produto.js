var express = require('express');
var router = express.Router();
var fs = require('fs');
var file = require('./../controller/file');
// jquery
var jsdom = require('jsdom').jsdom;
var document = jsdom('<html></html>', {});
var window = document.defaultView;
var $ = require('jquery')(window);

var isbn;

router.get('/', function(req, res, next) {
	var val = req.query;
	file.read(function(data){
		$(data).each(function (){
			if (this.isbn==val.cod){
				isbn = this.isbn
				console.log(isbn);
	  			res.render('./catalogo/produto', {title: "Bookstore - "+this.titulo, dados: this});
	  			res.end();
			}
		});
		if(req.originalUrl!='/catalogo/produto?cod='+isbn){
			console.log(isbn);
			res.render('./catalogo/produto', {title: "Bookstore", dados: 'error'});
		  	res.end();
		}
	});
});


module.exports = router;