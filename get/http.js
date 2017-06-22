var http = require('http');
// console.log(http);

//引入url模块
var url = require("url");
//引入queryString，用于格式化url上面的参数
var querystring = require('querystring');

http.createServer(function(request,response){


	console.log(request.url);
	//把我们参数部分截取出来
	var paramStr  = url.parse(request.url).query;
	var param = querystring.parse(paramStr);

	console.log(param["name"])
	
	response.setHeader('Access-Control-Allow-Origin','*');
	
	response.end('I`m the king of the world');

}).listen(12306);

