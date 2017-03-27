var jsdom = require('jsdom').jsdom;
var document = jsdom('<html></html>', {});
var window = document.defaultView;
var $ = require('jquery')(window);

var fs = require('fs');

module.exports = {
	read: function(callback){//callback é executado depois que a função terminar
		fs.readFile(__dirname + '/../'+'db/data.json', 'utf8', function(err, data){
			data = JSON.parse(data);//transforma o json em um objeto js manipulável
			$(data).each(function(){
				this.preço = this.preço.toFixed(2).toString().replace('.',',');
			})
			callback(data);
		});
	},
	readDesejos: function(callback){//callback é executado depois que a função terminar
		fs.readFile(__dirname + '/../'+'db/desejos.json', 'utf8', function(err, data){
			data = JSON.parse(data);//transforma o json em um objeto js manipulável
			callback(data);
		});
	},
	writeDesejos: function(dataJson, res){
		fs.writeFile(__dirname + '/../'+'db/desejos.json', dataJson, function(err){
			if(err)
				return console.log(err);
			
			res.end();
		});
	},
	readCarrinho: function(callback){//callback é executado depois que a função terminar
		fs.readFile(__dirname + '/../'+'db/carrinho.json', 'utf8', function(err, data){
			data = JSON.parse(data);//transforma o json em um objeto js manipulável
			callback(data);
		});
	},
	writeCarrinho: function(dataJson, res){
		fs.writeFile(__dirname + '/../'+'db/carrinho.json', dataJson, function(err){
			if(err)
				return console.log(err);
			
			res.end();
		});
	}
}