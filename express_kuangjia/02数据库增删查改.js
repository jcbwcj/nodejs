// --------------配置express------------------
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extend:false}));

// ---------------配置数据库连接---------------------
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

app.all('/show',function(req,res){
	var name = req.body.name;
	// console.log(req.body.name);
	res.append('Access-Control-Allow-Origin','*');

	connection.query('SELECT * FROM router_test', function(error, results, fields) {
		if(error) throw error;
		//results =>array类型
		console.log('The solution is: ', results);
		res.send(JSON.stringify(results));
	});
});

app.all('/insert',function(req,res){
	var name = req.body.name;
	console.log(req.qurey);
	res.append('Access-Control-Allow-Origin','*');
	insert(req,res,name);
});

app.all('/delete',function(req,res){
	var name = req.body.name;
	console.log(req.body);
	res.append('Access-Control-Allow-Origin','*');
	del(req,res,name);	
});

app.all('/select',function(req,res){
	var name = req.body.name;
	res.append('Access-Control-Allow-Origin','*');
	search(req,res,name);
});

app.all('/update',function(req,res){
	var name = req.body.name;
	var name2 = req.body.name2;
	res.append('Access-Control-Allow-Origin','*');
	update(req,res,name,name2);
});



var server = app.listen(8008,function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log('应用实例，访问地址为http://%s:%s',host,port);
});










function search(req, res,name) {
	connection.query('SELECT * FROM router_test where name = "'+name+'"', function(error, results, fields) {
		if(error) throw error;
		//results =>array类型
		console.log('The solution is: ', results);
		res.send(JSON.stringify(results));
	});
}

function insert(req, res,name) {
	connection.query("insert into router_test(name) values('"+name+"')", function(error, results, fields) {
		if(error) throw error;
		//results =>array类型
		console.log('The solution is: ', results);
		res.send(JSON.stringify(results));	
	});
}


function del(req, res,name) {
	connection.query(`delete from router_test where name = "${name}"`, function(error, results, fields) {
		if(error) throw error;
		//results =>array类型
		console.log('The solution is: ', results);
		res.send(JSON.stringify(results));		
	});
}


function update(req, res,name,name2) {
	connection.query(`update router_test set name = "${name}" where name = "${name2}"`, function(error, results, fields) {
		if(error) throw error;
		//results =>array类型
		console.log('The solution is: ', results);
		res.send(JSON.stringify(results));		
	});
}
