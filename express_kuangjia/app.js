var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extend:false}));

app.get('/',function(req,res){
	res.send('How are you ?');
});

app.get('/index',function(req,res){
	console.log(req.qurey);
	res.append('Access-Control-Allow-Origin','*');
	res.send('进入首页');
});

app.post('/home',function(req,res){
	console.log(req.body);
	res.append('Access-Control-Allow-Origin','*');
	res.send('进入home页面');	
});

app.all('/test',function(req,res){
	res.append('Access-Control-Allow-Origin','*');
	res.send('进入test页面');
});

var server = app.listen(8008,function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log('应用实例，访问地址为http://%s:%s',host,port);
});