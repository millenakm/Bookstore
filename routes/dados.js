var express = require('express');
var router = express.Router();
var fs = require('fs');
var file = require('./../controller/file');
var jsdom = require('jsdom').jsdom;
var document = jsdom('<html></html>', {});
var window = document.defaultView;
var $ = require('jquery')(window);

/* GET home page. */
router.get('/', function(req, res, next) {
	file.read(function(data){
		res.json(data.produtos);
	});
});

router.get('/:type/:cod', function(req, res) {
	var cod = req.params.cod;
	var type = req.params.type;
	file.read(function(data){
		for(i in data.produtos){
			if(data.produtos[i].isbn==cod && type=='wish'){
				if(data.produtos[i].favorito==false){
					data.produtos[i].favorito=true;
				}
				else if(data.produtos[i].favorito==true){
					data.produtos[i].favorito=false;
				}
				var dataFav = data;
				dataJson = JSON.stringify(dataFav);
				file.write(dataJson, res);
			}
			else if(data.produtos[i].isbn==cod && type=='cart'){
				if(data.produtos[i].carrinho==false){
					data.produtos[i].carrinho=true;
				}
				else if(data.produtos[i].carrinho==true){
					data.produtos[i].carrinho=false;
				}
				var dataCart = data;
				dataJson = JSON.stringify(dataCart);
				file.write(dataJson, res);
			}
		}
    	res.end();
	});
});

module.exports = router;