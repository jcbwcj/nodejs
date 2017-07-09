var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
var connection;

// 数据库连接
function createConnection(){
	connection = mysql.createConnection({
		host:'localhost',
		user:'root',
		password:'',
		database:'cj'
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
		createConnection();
		connection.connect();
		console.log(req.query);
		//设置分页 
		var pageCount = req.query.page - 1;

		// 'SELECT * FROM lagou limit(此处记得留一个空格！！！)'+ pageCount +',10'
		connection.query('SELECT * FROM goodslist1 limit '+ pageCount +',10', function(error, results, fields) {
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

app.post('/detail', function(req, res) {
	createConnection();
	console.log(req.body.id);
	var id = req.body.id;
	connection.query('SELECT * FROM goodslist1 where id =  ' + id, function(error, results, fields) {
		if(error) throw error;
		//results =>array类型
		console.log('The solution is: ', results);
		var obj = {
			detail: results
		}
		res.send(JSON.stringify(obj));
		connection.end();
	});
	res.append("Access-Control-Allow-Origin", "*")
})

//要post请求，并且路由是/home才能进入此逻辑
app.post('/home', function(req, res) {
	console.log(req.body)
	res.append("Access-Control-Allow-Origin", "*")
	res.send('进入到home页面');
})

//只要路由是/test就进入到此逻辑
app.all('/test', function(req, res) {
	console.log(req.cookies)
	res.send('进入到test页面');
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