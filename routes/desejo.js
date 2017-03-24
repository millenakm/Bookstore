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
	file.readDesejos(function(data){
		var isbn = req.query;
		for(var i=0; i<data.length; i++){
			if(data[i].add==isbn.add){
				check = false;
				// data = JSON.stringify(data);
				dataJson = data.splice(i, 1);
				dataJson = JSON.stringify(data);
				file.writeDesejos(dataJson, res);
				// res.send(i);
				// file.deleteDesejos(i, res, data);
			}
		}
		if(check==true){
			data.push(isbn);
			var dataJson = JSON.stringify(data);					
			file.writeDesejos(dataJson, res);
		}
		res.send(check);
	});

});
// /* GET home page. */
// router.get('/', function(req, res, next) {
// 	file.readDesejos(function(data){
// 		var isbn = req.query;
// 		$(data).each(function(){
// 			if(this.isbn==isbn){
// 				check = 1;
// 			}
// 		});
// 		if(check==1){
// 			data.push(isbn);
// 		var dataJson = JSON.stringify(data);					
// 		file.write(dataJson, res);
// 		res.send(data);
// 		}
		
//   		// res.render('./catalogo/index', {title: "Bookstore", dados: data});
// 		// res.send('adicionado');
// 	});

// });


module.exports = router;