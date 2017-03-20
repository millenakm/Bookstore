var fs = require('fs');

module.exports = {
	read: function(callback){//callback é executado depois que a função terminar
		fs.readFile(__dirname + '/../'+'db/data.json', 'utf8', function(err, data){
			if(err)
				return console.log(err);
			data = JSON.parse(data);//transforma o json em um objeto js manipulável
			console.log(data[1].categoria);
			callback(data);
		});
	}
}