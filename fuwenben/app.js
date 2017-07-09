var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var mysql = require("mysql");
var connection;

function createConnection() {
	connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'nodejs'
	});
}
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({
		extended: false
	}))
//设置静态文件 app.js根目录下寻找public文件夹作为静态文件夹
app.use(express.static('public'));
	// parse application/json 
	//是要get请求并且匹配到路由`/`，我就执行回调，并用`res.send`方法去相应结果
app.post('/fuwenben', function(req, res) {
		createConnection();
		connection.connect();
		/*console.log(req.body.id)*/
		var id = req.body.id;
		connection.query('INSERT INTO fuwenben (html) VALUES ("'+req.body.text+'")', function(error, results, fields) {
			if(error) throw error;
			//results =>array类型
		/*	console.log('The solution is: ', results);*/
			var obj = {
				detail: results
			}
			res.send(JSON.stringify(obj));
			connection.end();
		});
		res.append("Access-Control-Allow-Origin", "*")
	})
app.listen(666);