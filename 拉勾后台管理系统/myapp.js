var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
var connection;

// 数据库连接-----------------------------------------
function createConnection(){
	connection = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'',
		database:'nodejs'
	});
}

app.use(bodyParser.urlencoded({extended:false}));
// 设置静态文件 app.js根目录下寻找public文件夹作为静态文件夹
app.use(express.static('public'));
app.get('',function(req,res){
	res.send("I'm the king of the world");
})

app.set('views','./views');
app.set('view enginer','jade');
app.get("/jade",function(req,res){
	//提供数据给jade模板
	res.render("home",{
		name:"laoxie"
	})
})

//中间件
app.get('/jobs', function(req, res) {
		createConnection()
		connection.connect();
		console.log(req.query);
		//设置分页 
		var pageCount = 10*(req.query.page - 1);

		// 'SELECT * FROM lagou limit(此处记得留一个空格！！！)'+ pageCount +',10'
		connection.query('SELECT * FROM lagou limit '+ pageCount +',10', function(error, results, fields) {
			if(error) throw error;
			//results =>array类型
			console.log('The solution is: ', results);
			var obj = {
				jobs: results
			}

			res.send(JSON.stringify(obj));
			connection.end();
		});
		console.log(req.query)
		res.append("Access-Control-Allow-Origin", "*")
	})

// 富文本------------------------------------------------
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


//数据库写入-----------------------------------------------
app.post('/insert', function(req, res) {
	console.log(req.body)
	createConnection();
	connection.connect();
	res.append("Access-Control-Allow-Origin", "*");

	var company = req.body.company;
    var position_name = req.body.position_name;
    var salary = req.body.salary;
    var industry = req.body.industry;
	connection.query("insert into houtai(company,salary,position_name,industry) values('"+company+"','"+salary+"','"+position_name+"','"+industry+"');",function(error, results, fields){
		if(error) throw error;
		res.send('ok');
		connection.end();
	})
	
})

// 数据库修改-----------------------------------
app.post('/update', function(req, res) {
	console.log(req.body)
	createConnection();
	connection.connect();
	res.append("Access-Control-Allow-Origin", "*");

	var company = req.body.company;
    var position_name = req.body.position_name;
    var salary = req.body.salary;
    var industry = req.body.industry;
    var id = req.body.id;
	connection.query(`update houtai set company = '${company}',position_name = '${position_name}',salary = '${salary}',industry = '${industry}' where id = ${id}`,function(error, results, fields){
		if(error) throw error;
		res.send('ok');
		connection.end();
	})
})

// 数据库删除----------------------------------
app.post('/del', function(req, res) {
	console.log(req.body)
	createConnection();
	connection.connect();
	res.append("Access-Control-Allow-Origin", "*");
 
    var id = req.body.id;
	connection.query(`delete from houtai where id = ${id}`,function(error, results, fields){
		if(error) throw error;
		res.send('ok');
		connection.end();
	})
})

//只要路由是/table就进入到此逻辑
app.all('/table', function(req, res) {
	res.append("Access-Control-Allow-Origin", "*");
	createConnection();
	connection.connect();
	// console.log(req.body.num);
	var pageNo = req.body.pageNo;
	var qty = req.body.qty;
	var totalpage;
	connection.query('select count(*) from houtai',function(error, results, fields){
		// console.log(results[0]['count(*)']);
		// results=>[{ 'count(*)': 39 }],用点语法无法获取
		totalpage = Math.ceil(results[0]['count(*)']/pageNo);
	})
	connection.query(`SELECT * FROM houtai limit ${(pageNo-1)*qty},${qty}`, function(error, results, fields) {
		if(error) throw error;
		//results =>array类型
		console.log(results);
		var obj = {
			msg:results,
			totalpage:totalpage
		}
		res.send(obj);
		connection.end();
	});
})



app.post('/table_search', function(req, res) {
		createConnection()
		connection.connect();

		var msg = req.body.msg;

		connection.query(`SELECT * FROM houtai where industry like '%${msg}%' `, function(error, results, fields) {
			if(error) throw error;
			//results =>array类型
			console.log('The solution is: ', results);
			res.send(results);
			connection.end();
		});
		console.log(req.query)
		res.append("Access-Control-Allow-Origin", "*")
	})



var server = app.listen(666, function() {
	//测试
	var host = server.address().address
	var port = server.address().port
	console.log("应用实例，访问地址为 http://%s:%s", host, port)
})



// 上传文件----------------------------------------------------
var multer = require('multer');
var imgurl;
var storage = multer.diskStorage({
	//设置上传后文件路径，uploads文件夹不会自动创建。
	destination: function(req, file, cb) {
		cb(null, './uploads')
	},
	//给上传文件重命名，获取添加后缀名
	filename: function(req, file, cb) {
		var fileFormat = (file.originalname).split(".");
		//给图片加上时间戳格式防止重名名
		//比如把 abc.jpg图片切割为数组[abc,jpg],然后用数组长度-1来获取后缀名
		imgurl =  file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1];
		cb(null, imgurl);
	}
});
var upload = multer({
	storage: storage
});
app.post('/upload-single', upload.any(), function(req, res, next) {	
	res.append("Access-Control-Allow-Origin","*");
	res.send(imgurl);
});

// 注册、登录--------------------------------------------------
app.post('/register',function(req,res){
	createConnection();
	connection.connect();
	// console.log(req.body.id);
	var username = req.body.username;
	var password = req.body.password;
	console.log(username,password);
	connection.query('SELECT * FROM usermsg where username =  "'+username+'"', function(error, results, fields) {
		if(error) throw error;
		//results =>array类型
		console.log(results);
		if(results.length>=1){
			res.send('no');
			console.log('no');
		}else{
			connection.query("insert into usermsg(username,password) values('"+username+"','"+password+"');",function(){});
			res.send('ok');
			console.log('yes');

		}
		connection.end();
	});
	res.append("Access-Control-Allow-Origin", "*")
})


app.post('/login',function(req,res){
	createConnection();
	connection.connect();
	// console.log(req.body.id);
	var username = req.body.username;
	var password = req.body.password;
	console.log(username,password);
	connection.query('SELECT * FROM usermsg where username =  "'+username+'"', function(error, results, fields) {
		if(error) throw error;
		//results =>array类型
		console.log(results);
		if(results.length<1){
			res.send('usernameno');
		}else if(results[0].password != password){
			res.send('passwordno');
		}else{
			res.send('yes');
		}
		connection.end();
	});
	res.append("Access-Control-Allow-Origin", "*")
})



// 跳转到数据库修改页面，获取需要修改的数据
app.post('/change', function(req, res) {
	createConnection();
	connection.connect();
	console.log(req.body.id);
	var id = req.body.id;
	connection.query('SELECT * FROM houtai where id =' + id, function(error, results, fields) {
		if(error) throw error;
		//results =>array类型
		console.log('The solution is: ', results);
		res.send(results);
		connection.end();
	});
	res.append("Access-Control-Allow-Origin", "*")
})