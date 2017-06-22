var fs = require('fs');

// 同步
// console.log(fs.readFileSync('input.txt'));
 
// 异步
fs.readFile("input.txt",function(err,data){
	//把缓冲流(数据)转化为字符串
	console.log(data.toString())
})