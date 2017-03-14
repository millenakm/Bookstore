var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET users listing. */
router.get('/', function(req, res, next){//rota (localhost:porta/list-users)
	fs.readFile(__dirname + '/../db/data.json', 'utf8', function(err, data){
		var dados = JSON.parse(data);
		res.render('users', {title: 'Usuários', dados: dados, dadosTam: dados.length});
	});
});

module.exports = router;
