var mysql = require('mysql');

// 配置数据库连接
var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'',
	database:'cj'
});

// 进行数据库连接
connection.connect();

// 执行sql语句
connection.query('select * from goodslist1',function(error,results,fields){
	if(error) throw error;
	console.log('The solution is: ',results);

});

// 关闭数据库连接
connection.end();