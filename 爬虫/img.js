var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mysql =require("mysql");
var connection;
function show(){
	connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'nodejs'
	});
}
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//中间件
app.post('/search',function(req,res){
	show();
	connection.connect();
	connection.query('SELECT * FROM meizitu', function(error, results, fields) {
		if(error) throw error;
		//results =>array类型
		console.log('The solution is: ', results);
		 
		res.send(JSON.stringify(obj));
		connection.end();
	});
	
	res.append("Access-Control-Allow-Origin","*")

})




/*app.post('/add',function(req,res){
	show();
	//进行数据库连接
	connection.connect();
	var params =req.body;
	require("./router/add.js").add(req, res,params,connection);
	console.log(req.body)
	
	res.append("Access-Control-Allow-Origin","*")
	
})
app.post('/update',function(req,res){
	show();
	//进行数据库连接
	connection.connect();
	var params =req.body;
	require("./router/update.js").update(req, res,params,connection);
	console.log(req.body)
	res.append("Access-Control-Allow-Origin","*")
	
})
app.post('/delete',function(req,res){
	show();
	//进行数据库连接
	connection.connect();
	var params =req.body;
	require("./router/del.js").del(req, res,params,connection);
	console.log(req.body)
	res.append("Access-Control-Allow-Origin","*")
})*/


/*var server = app.listen(8081,function(){
	var host= server.address().address;
	var port = server.address().port;
	console.log("应用实例地址",host,port)
})
*/
app.listen(12346);
console.log("开启服务器")
