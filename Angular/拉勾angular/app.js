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
		createConnection();
		connection.connect();
		console.log(req.query);
		//设置分页 
		var pageCount = req.query.page - 1;

		// 'SELECT * FROM lagou limit(此处记得留一个空格！！！)'+ pageCount +',10'
		connection.query('SELECT * FROM lagou limit '+ pageCount*10 +',10', function(error, results, fields) {
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
	connection.connect();
	console.log(req.body.id);
	var id = req.body.id;
	connection.query('SELECT * FROM lagou where id =  ' + id, function(error, results, fields) {
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

//收藏--------------------------
app.post('/shoucang', function(req, res) {
	createConnection();
	connection.connect();
	var msgId = req.body.msgId;
	var username = req.body.username;
	console.log(msgId,username,688888888)
	connection.query(`select msgId from usermsg where username = '${username}';`, function(error, results, fields){
		if(error) throw error;
		console.log(results[0].msgId);
		var str = results[0].msgId;
		if(str.length>=1){
			str += ','+msgId;
		}else{
			str = msgId;
		}		
		console.log(str);
		connection.query(`update usermsg set msgId = '${str}' where username = '${username}';`,function(error, results, fields){
			if(error) throw error;
			res.send('收藏成功');
		})
	})
	res.append("Access-Control-Allow-Origin", "*")
})
// 收藏页---------------------------
app.all('/collectlist', function(req, res) {
	createConnection();
	connection.connect();
	var username = req.body.username;
	connection.query(`select msgId from usermsg where username = '${username}';`, function(error, results, fields){
		if(error) throw error;
		// console.log(results[0].msgId);
		if(!results[0].msgId){
			res.send('nonono');		
		}else{			
			/*var arr = results[0].msgId.split(',');
			// 去重
			for(var i=0;i<arr.length;i++){
				for(var j=i+1;j<arr.length;j++){
					if(arr[i] == arr[j]){
						arr.splice(j--,1)
					}
				}
			}*/
			var str = '('+results[0].msgId+')';
			// console.log(str);
			// select * from usermsg where id in (1,2,5,7,9);若有重复会自动剔除不会显示两次
			connection.query(`select * from lagou where id in ${str};`,function(error, results, fields){
				if(error) throw error;
				res.send(results);
			});
		}
	})
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

// 头像写入数据库--------------------
app.post('/upload-touxiang',function(req,res){
	createConnection();
	connection.connect();
	var username = req.body.username;
	connection.query(`update usermsg set imgurl = '${imgurl}' where username = '${username}';`, function(error, results, fields){
		if(error) throw error;
		res.send('ok666');
	})
	res.append("Access-Control-Allow-Origin", "*")
})

app.post('/touxiang',function(req,res){
	createConnection();
	connection.connect();
	var username = req.body.username;
	connection.query(`select * from usermsg where username = '${username}';`, function(error, results, fields){
		if(error) throw error;
		res.send(results);
	})
	res.append("Access-Control-Allow-Origin", "*")
})

// 搜索---------------------------------------
app.post('/search',function(req,res){
	createConnection();
	connection.connect();
	var msg = req.body.msg;
	connection.query(`select * from lagou where industry like '%${msg}%'`, function(error, results, fields){
		if(error) throw error;
		res.send(results);
	})
	res.append("Access-Control-Allow-Origin", "*")
})
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