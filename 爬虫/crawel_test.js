var http = require('http');
// nodejs 版本的jq
var cheerio = require('cheerio');

// 受网速限制，下载速度慢而循环很快
// 导致部分图片还没下载玩就开始下一次循环
// 若只是将信息记录下来则没有此影响

var fs = require('fs');
for(j=1;j<11;j++){
	http.get('http://www.mzitu.com/zipai/comment-page-2/',function(res){
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
			// console.log(list)
			
			var obj = {
				list:list
			};

			var i = 0;
			function download(list){
				console.log(list[i]);
				var length = list.length;
				i = i>10 ? i : '0'+i;
				j = j>10 ? j : '0'+j;
				// 创建一个可写流
				var writeStream = fs.createWriteStream('meizitu/'+ j+i +'.jpg'); 
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

}


