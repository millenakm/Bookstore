var express = require('express');
var router = express.Router();

var CodeGenerator = require('node-code-generator');
var generator = new CodeGenerator();
var pattern = '*****';
var howMany = 38;
var options = {};
// Generate an array of random unique codes according to the provided pattern: 
var codes = generator.generateCodes(pattern, howMany, options);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: codes });
});

module.exports = router;
