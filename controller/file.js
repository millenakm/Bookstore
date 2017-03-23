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
	}
}