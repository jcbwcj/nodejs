var http = require('http');
// nodejs 版本的jq
var cheerio = require('cheerio');

var fs = require('fs');

http.get('http://www.mzitu.com/zipai/comment-page-8/',function(res){
	var data = '';
	res.on('data',function(chunk){
		data += chunk;
	});
	res.on('end',function(){
		var $ = cheerio.load(data);
		var list = [];
		$('img').each(function(index,ele){
			// 获取爬到的src地址
			var src = $(ele).attr('src');
			
			list.push(src);
		});
		download(list);
		
		var obj = {
			list:list
		};

		/*// 创建一个可写流
		var writeStream = fs.createWriteStream('INPUT.txt');
		// 写入字符串
		writeStream.write(JSON.stringify(obj));
		// 结束监听
		writeStream.end();
		writeStream.on('finish',function(){});*/
		//console.log(obj);
	});
});
var i = 0;
function download(list){
	console.log(list[i]);
	var length = list.length;
	i = i>=10 ? i : '0' + i;
	// 创建一个可写流
	var writeStream = fs.createWriteStream('images/1'+ i +'.jpg'); 
	http.get(list[i],function(res){
		res.pipe(writeStream);
		if(i < length){
			i++;
			console.log("完成第"+i+"/"+length+"张");
			download(list);
		}else{
			return;
		}
	});
};
