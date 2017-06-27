var http = require('http');
var querystring = require('querystring');
var url = require('url');
// var cheerio = require('cheerio');
var mysql = require("mysql");

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'nodejs'
});

//进行数据库连接
connection.connect();

http.createServer(function(request,response){
	var post = '';
	request.on('data',function(msg){
		post += msg;
	});

	request.on('end',function(){
		var params = querystring.parse(post);
		var name = params.name ? params.name : '';
		// console.log(name);

		connection.query('select * from `meizitu`', function(error, results, fields) {
				if(error) throw error;
				var obj = {
					news: results
				}
				response.end(JSON.stringify(obj));
			});

	
	});

	response.setHeader('Access-Control-Allow-Origin','*');

}).listen(12346);


