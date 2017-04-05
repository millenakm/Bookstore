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

router.get('/:cod', function(req, res, next) {
	var cod = req.params.cod;
	file.read(function(data){
		$(data).each(function (){
			if (this.isbn==cod){
	  			res.render('./catalogo/produto', {title: "Bookstore - "+this.titulo, dados: this});
	  			res.end();
			}
		});
		if(req.originalUrl!='/catalogo/produto/:cod'){
			res.render('./catalogo/produto', {title: "Bookstore", dados: 'error'});
		  	res.end();
		}
	});
});


module.exports = router;