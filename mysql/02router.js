var http = require('http');

var querystring = require('querystring');
var mysql = require('mysql');
var url = require('url');
// 配置数据库连接
var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'',
	database:'cj'
});

// 进行数据库连接
connection.connect();

http.createServer(function(request,response){
	// console.log(url.parse(request.url).pathname);

	var post = '';
	request.on('data',function(msg){
		post += msg;
	});
	request.on('end',function(){
		var params = querystring.parse(post);
		console.log(typeof params);
		var name = params.name ? params.name : '';
		console.log(name);

		switch(url.parse(request.url).pathname){
			case '/search':
				search(request,response,name);
				break;
			case '/insert':
				insert(request,response,name);
				break;
			case '/show':
				search(request,response,name);
				break;
			case '/delete':
				del(request,response,name);
				break;

		}
	});

	response.setHeader('Access-Control-Allow-Origin','*');

}).listen(12306);







function search(request, response,name) {
	connection.query('SELECT * FROM router_test where name = "'+name+'"', function(error, results, fields) {
		if(error) throw error;
		//results =>array类型
		console.log('The solution is: ', results);
		var obj = {
			news: results
		}
		response.end(JSON.stringify(results));
	});
}

function insert(request, response,name) {
	connection.query("insert into router_test(name) values('"+name+"')", function(error, results, fields) {
		if(error) throw error;
		//results =>array类型
		console.log('The solution is: ', results);
		var obj = {
			news: results
		}
		response.end(JSON.stringify(obj));		
	});
}


function del(request, response,name) {
	connection.query(`delete from router_test where name = "${name}"`, function(error, results, fields) {
		if(error) throw error;
		//results =>array类型
		console.log('The solution is: ', results);
		var obj = {
			news: results
		}
		response.end(JSON.stringify(obj));		
	});
}
