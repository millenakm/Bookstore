var express = require('express');
var router = express.Router();
var fs = require('fs');
var file = require('./../controller/file');
var check = false;

/* GET home page. */
router.get('/', function(req, res, next) {
	file.read(function(data){
		res.json(data);
	});
});

router.post('/:cod', function(req, res) {
    var cod = req.body;
    console.log(cod);

    res.end();
});

module.exports = router;