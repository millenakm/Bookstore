var express = require('express');
var router = express.Router();
var fs = require('fs');
var file = require('./../controller/file');
var jsdom = require('jsdom').jsdom;
var document = jsdom('<html></html>', {});
var window = document.defaultView;
var $ = require('jquery')(window);
var check = 'zero';

/* GET home page. */
router.get('/', function(req, res, next) {
	file.readDesejos(function(data){
		var isbn = req.query;
		$(data).each(function(){
			res.send(this.add);
			if(this.add==isbn.add){
				// res.send(this.isbn);
				check = 'um';
			}
		});
		res.send(check);
	});

});


module.exports = router;