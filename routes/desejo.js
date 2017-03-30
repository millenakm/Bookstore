var express = require('express');
var router = express.Router();
var fs = require('fs');
var file = require('./../controller/file');
var jsdom = require('jsdom').jsdom;
var document = jsdom('<html></html>', {});
var window = document.defaultView;
var $ = require('jquery')(window);


router.get('/', function(req, res, next) {
	var check = true;
	var param = req.query;
	file.readDesejos(function(data){
		if(param.op == 'adicionar'){
			for(var i=0; i<data.length; i++){
				if(data[i]==param.add){
					check = false;
					dataJson = data.splice(i, 1);
					dataJson = JSON.stringify(data);
					file.writeDesejos(dataJson, res);
				}
			}
			if(check==true){
				data.push(param.add);
				var dataJson = JSON.stringify(data);					
				file.writeDesejos(dataJson, res);
			}
			res.send(check);
		}
		else if(param.op == 'listar'){
			res.send(data);
		}
		else{
			file.read(function(dadosGerais){
				res.render('./catalogo/desejos', {title: "Desejos", desejados: data, dados: dadosGerais});
				res.end();
			});	
		}
	});
});

module.exports = router;