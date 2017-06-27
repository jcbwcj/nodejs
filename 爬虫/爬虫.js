var http = require("http");
// cheerio nodejs版的jq 第三方插件
var cheerio = require("cheerio");
http.get("http://www.mzitu.com/zipai/comment-page-1/",function(res){
	var data ="";
	res.on('data',function(chunk){
		data +=chunk
	})
	res.on('end',function(){
		var $=cheerio.load(data);
		$('img').each(function(index,ele){
			console.log($(ele).attr("src"))
		})
	})
})

// 利用这种方式的爬虫无法获取动态生成的html部分，无法解析js代码