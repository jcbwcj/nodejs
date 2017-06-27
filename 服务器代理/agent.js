var http = require('http');

http.request({
	hostname:'localhost',
	port:'80',
	path:'/nodejs/test.php?name=laoxie',
	// 路径前后的几个/不能掉，否则会报错，在nodejs会出现莫名的html结构代码
	method:'get'
},function(res){
	res.setEncoding('utf8');
	var data = '';
	res.on('data',function(chunk){
		data += chunk;
	});
	res.on('end',function(){
		console.log(data);
	});
}).on('error',function(e){
	console.log('problem with request: ' + e.message);	
}).end();
// 最后面的end不要忘了