var http = require("http");

var querystring = require("querystring");

http.createServer(function(request,response){
	var post = '';
	request.on('data',function(msg){
		post += msg;
	});
	request.on('end',function(){
		console.log(post);
		console.log(querystring.parse(post))
	});

	response.setHeader('Access-Control-Allow-Origin','*');
	response.end("I'm the king of world!!!");
}).listen(12306);