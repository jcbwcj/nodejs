var express = require('express')
var app = express();
var fs = require('fs')
var mysql = require('mysql')

var http = require('http')
var connection;

var cheerio = require('cheerio')
//连接服务器配置.......................................................................
function createConnection() {
	connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'nodejs'
	});
}

//爬goods商品信息
app.get('/goods', function(req, res) {
	console.log('进入/路由')
	res.append('Access-Control-Allow-Origin', '*');
	createConnection()
	connection.connect();

	function lazy(url) {
		http.get(url, function(data) {
			var str = '';
			data.setEncoding('utf8');
			data.on('data', function(chunk) {
				str += chunk
			})
			data.on('end', function() {

				var strObj = JSON.parse(str)
				if(strObj.code == 0) {
					console.log("进入if")
					goods = strObj.data.goods
					var gid = goods.gid;
					var agio = goods.agio;
					var allImages = goods.allImages;
					var brandId = goods.brandId;
					var brandStoreName = goods.brandStoreName;
					var channelFeatureList = goods.channelFeatureList;
					var descriptions = JSON.stringify(goods.descriptions);
					var detailImage = goods.detailImage;
					var discount = goods.discount;
					var largeImage = goods.largeImage;
					var marketPrice = goods.marketPrice;
					var middleImage = goods.middleImage;
					var name = goods.name;
					var pmsList = JSON.stringify(goods.pmsList);
					var pointDescribe = goods.pointDescribe;
					var pollenTips = goods.pollenTips;
					var smallImage = goods.smallImage;
					var sn = goods.sn;
					var verticalImage = goods.verticalImage;
					var vipshopPrice = goods.vipshopPrice;
					/*connection.query(`SELECT gid from mask where gid = ${gid}`, function(err, data) {
					
						if(data.length == 0) {
							connection.query(`INSERT into mask (gid,agio,allImages,brandId,brandStoreName,channelFeatureList,descriptions,detailImage,discount,largeImage,marketPrice,middleImage,name,pmsList,pointDescribe,pollenTips,smallImage,sn,verticalImage,vipshopPrice)values(${gid},'${agio}','${allImages}',${brandId},'${brandStoreName}','${channelFeatureList}','${descriptions}','${detailImage}','${discount}','${largeImage}',${marketPrice},'${middleImage}','${name}','${pmsList}','${pointDescribe}','${pollenTips}','${smallImage}','${sn}','${verticalImage}',${vipshopPrice})`, function(error, results, fields) {
								if(error) throw error;
								//results =>array类型
								console.log('The solution is: ', results);
								//把数据整理，返回到前端
								var obj = {
									news: results,
								}

							});
							
						} 

					})*/
					console.log(66666666666666,name)

				} else {
					console.log('爬的该gid不存在')
				}

			})
		})

	}

	for(var i = 166483012; i <= 166485312; i++) {
		lazy('http://w.lefeng.com/api/neptune/goods/detail_with_stock/v1?needBrandInfo=true&gid=' + i)
		console.log('正在爬第' + i + '个网页')

	}
	
	res.send('正在还没有爬完网页');
	

})



//爬主页的品牌专场的信息
app.get('/index', function(req, res) {
	console.log('进入/路由')
	res.append('Access-Control-Allow-Origin', '*');
	createConnection()
	connection.connect();

	function lazy(url) {
		http.get(url, function(content) {
			var str = '';
			content.setEncoding('utf8');
			content.on('data', function(chunk) {
				str += chunk
			})
			content.on('end', function() {
				//把返回的信息变成对象
				var strObj = JSON.parse(str)
				if(strObj.code == 0) {
					console.log("进入if")
					var data = strObj.data;
					data.forEach(function(items) {

						var bid = items.bid;

						var agio = items.agio;
						var brandImage = items.brandImage;
						var name = items.name;
						var pms = items.pms;

						connection.query(`SELECT bid from Brand where bid = ${bid}`, function(err, res) {
							
							//						console.log(res)
							if(res.length == 0) {
								connection.query(`INSERT into Brand (bid,agio,brandImage,name,pms)values(${bid},'${agio}','${brandImage}','${name}','${pms}')`, function(error, results, fields) {
									if(error) throw error;
									//results =>array类型
									console.log('The solution is: ', results);
									
									var obj = {
										news: results,
									}

								});

							}

						})
					})

				} else {
					console.log('爬的该gid不存在')
				}

			})
		})

	}
	//		lazy('http://w.lefeng.com/api/neptune/special_brands/v3?page=3&labelType=1')
	for(var i = 1; i <= 9; i++) {
		lazy('http://w.lefeng.com/api/neptune/special_brands/v3?page=' + i + '&labelType=1')
		console.log('正在爬第' + i + '个网页')

	}
	
	res.send('正在还没有爬完网页');

	
})



//伪造评论数、好评，中评，差评数量
app.get('/comment', function(req, res) {
	res.append('Access-Control-Allow-Origin', '*');
	createConnection()
	connection.connect();
//封装生成随机数的函数
	function randomNum(min, max) {
		var num = Math.floor(Math.random() * (max - min + 1)) + min;
		return num;
	}
//封装伪造函数
	function createCom() {
		var badCount = randomNum(0, 5);
		var goodCount = randomNum(0, 4000);
		var mediumCount = randomNum(0, 100);
		var totalCount = badCount + goodCount + mediumCount;
		var greatScale = (goodCount * 100 / (totalCount)).toFixed(2) + '%'
		var commObj = {
			"badCount": badCount,
			"goodCount": goodCount,
			"greatScale": greatScale,
			"mediumCount": mediumCount,
			"totalCount": totalCount
		}
		return commObj
	}

	connection.query(`select gid from goods`, function(err, data) {

		data.forEach(function(items) {
//			把伪造的出来的数组变成字符串存进数据库中
			var objStr = JSON.stringify(createCom());
			console.log(objStr)
			connection.query(`update goods set commentNumber = '${objStr}' where gid = ${items.gid}`, function(err, aaa) {

			})
		})
	})

})

//伪造评论
app.get('/creatComment', function(req, res) {
	res.append('Access-Control-Allow-Origin', '*');
	createConnection()
	connection.connect();
//爬几个借口，或者直接在网页改参数，访问接口，得到的数据在网上找工具转码成中文，搞出这个评论数组

	var arr = [{
		"score": 5,
		"content": "一直在用，感觉棒棒哒！",
		"authorName": "186*****021",
		"postAt": 1498642997000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "一直在用，感觉棒棒哒！",
		"authorName": "186*****021",
		"postAt": 1498642980000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "还没用，看起来不错！",
		"authorName": "筱宅****",
		"postAt": 1498530672000,
		"authorAvatar": "http:\/\/a.vpimg3.com\/upload\/lfapp\/2017\/04\/24\/110\/avatar_gbyy.jpg"
	}, {
		"score": 5,
		"content": "挺好的，精华挺多的",
		"authorName": "150*****023",
		"postAt": 1498340690000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "很不错的一次网购",
		"authorName": "180*****811",
		"postAt": 1498313443000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "还可以吧！！",
		"authorName": "180*****088",
		"postAt": 1498119123000,
		"authorAvatar": ""
	}, {
		"score": 3,
		"content": "面膜材质不好，有点扎，不过价格很便宜，总体不错",
		"authorName": "wei****",
		"postAt": 1498022404000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "还可以，不错",
		"authorName": "188*****018",
		"postAt": 1497920833000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "很补水，效果很好",
		"authorName": "joy****",
		"postAt": 1497892714000,
		"authorAvatar": "http:\/\/a.vpimg3.com\/upload\/lfapp\/2017\/02\/01\/199\/avatar_nyks.jpg"
	}, {
		"score": 5,
		"content": "效果挺好的",
		"authorName": "183*****178",
		"postAt": 1497800816000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "买过几次了",
		"authorName": "139*****966",
		"postAt": 1497792066000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "一如既往地好",
		"authorName": "139*****966",
		"postAt": 1497791979000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "补水效果好",
		"authorName": "188*****974",
		"postAt": 1497787644000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "补水效果还不错",
		"authorName": "188*****974",
		"postAt": 1497787600000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "特别好用，而且是正品。",
		"authorName": "180*****576",
		"postAt": 1497771206000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "还没用，看着还不错",
		"authorName": "136*****007",
		"postAt": 1497696109000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "一直都在用这个牌子",
		"authorName": "188*****299",
		"postAt": 1497687574000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "用完了。。。",
		"authorName": "187*****717",
		"postAt": 1497649890000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "还不错的样子",
		"authorName": "me雙****",
		"postAt": 1497600972000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "很不错的商品",
		"authorName": "美丽****",
		"postAt": 1497575697000,
		"authorAvatar": ""
	}, {
		"score": 3,
		"content": "油，补水一般",
		"authorName": "156*****900",
		"postAt": 1497534929000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "下次还来买",
		"authorName": "135*****283",
		"postAt": 1497531121000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "物有所值，",
		"authorName": "134*****724",
		"postAt": 1497481595000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": ".......",
		"authorName": "181*****960",
		"postAt": 1497416116000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "很好   满意",
		"authorName": "182*****671",
		"postAt": 1497198778000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "补水很好，挺满意的",
		"authorName": "180*****971",
		"postAt": 1497171608000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "面膜还不错就是有点小贵了用了脸上挺舒服的",
		"authorName": "138*****097",
		"postAt": 1496417108000,
		"authorAvatar": "http:\/\/a.vpimg3.com\/upload\/lfapp\/2016\/12\/07\/105\/avatar778_zlsq.jpg"
	}, {
		"score": 5,
		"content": "有效果就是好",
		"authorName": "方小丫****",
		"postAt": 1496298808000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "有点香，还是不错",
		"authorName": "lmh****",
		"postAt": 1496196932000,
		"authorAvatar": "http:\/\/a.vpimg3.com\/upload\/lfapp\/2017\/04\/25\/198\/avatar_wloq.jpg"
	}, {
		"score": 5,
		"content": "满意满意\n啦",
		"authorName": "157*****817",
		"postAt": 1496127031000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "还没用，用了再来评……",
		"authorName": "wei****",
		"postAt": 1498839797000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "补水面膜，",
		"authorName": "150*****317",
		"postAt": 1498812488000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "丽得姿的忠实粉丝",
		"authorName": "151*****544",
		"postAt": 1498782959000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "挺好得补水效果可以 修复功能不错",
		"authorName": "134*****362",
		"postAt": 1498730437000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "一直用这个牌子的面膜，天天敷，效果好价钱也不贵，性价比超高",
		"authorName": "tin****",
		"postAt": 1498707775000,
		"authorAvatar": "http:\/\/a.vpimg3.com\/upload\/lfapp\/2016\/08\/06\/133\/avatar_khrv.jpg"
	}, {
		"score": 5,
		"content": "一直在用的挺好",
		"authorName": "159*****755",
		"postAt": 1498640438000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "一如既往的好用，值得回购",
		"authorName": "吴炜琳****",
		"postAt": 1498547547000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "第二次回购了",
		"authorName": "孙雪****",
		"postAt": 1498532589000,
		"authorAvatar": "http:\/\/a.vpimg3.com\/upload\/lfapp\/2017\/02\/28\/59\/avatar291_ldxw.jpg"
	}, {
		"score": 5,
		"content": "补水不错。",
		"authorName": "孙雪****",
		"postAt": 1498532570000,
		"authorAvatar": "http:\/\/a.vpimg3.com\/upload\/lfapp\/2017\/02\/28\/59\/avatar291_ldxw.jpg"
	}, {
		"score": 5,
		"content": "用很多了，不错",
		"authorName": "137*****553",
		"postAt": 1498459069000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "不错，一直用",
		"authorName": "182*****562",
		"postAt": 1498404078000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "便宜又好用",
		"authorName": "180*****138",
		"postAt": 1498378547000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "很好用，补水",
		"authorName": "135*****683",
		"postAt": 1498370759000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "挺水润的，",
		"authorName": "爱萍儿****",
		"postAt": 1498317646000,
		"authorAvatar": "http:\/\/a.vpimg3.com\/upload\/lfapp\/2016\/12\/27\/149\/avatar856_uuil.jpg"
	}, {
		"score": 5,
		"content": "效果不错😄",
		"authorName": "152*****673",
		"postAt": 1498284090000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "很好一直在乐峰网买",
		"authorName": "183*****815",
		"postAt": 1498212262000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "用了好几盒了，屯着",
		"authorName": "137*****001",
		"postAt": 1498205271000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "补水效果不是一般的好",
		"authorName": "155*****190",
		"postAt": 1498201858000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "一直用这个感觉还不错",
		"authorName": "133*****826",
		"postAt": 1498187897000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "非常好用，推荐了好多朋友都来乐蜂网买面膜，实惠才是王道",
		"authorName": "155*****592",
		"postAt": 1498103802000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "满199减100的活动，太给力，买了两盒，用了之后感觉还不错，蛮滋润的，还要买",
		"authorName": "186*****336",
		"postAt": 1498098805000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "补水效果非常棒",
		"authorName": "快乐的****",
		"postAt": 1498094328000,
		"authorAvatar": "http:\/\/a.vpimg3.com\/upload\/lfapp\/2017\/03\/31\/113\/avatar_lssz.jpg"
	}, {
		"score": 5,
		"content": "补水效果很好",
		"authorName": "136*****257",
		"postAt": 1498049495000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "补水效果很好",
		"authorName": "136*****257",
		"postAt": 1498049467000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "第二次买了，特别好用",
		"authorName": "qq:****",
		"postAt": 1497972247000,
		"authorAvatar": "http:\/\/a.vpimg3.com\/upload\/lfapp\/2017\/03\/20\/95\/avatar573_qrwd.jpg"
	}, {
		"score": 5,
		"content": "补水效果很好",
		"authorName": "189*****101",
		"postAt": 1497949517000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "之前用过补水的还不错，补水修复的应该也不错吧，就买来试试，而且真的是超级无敌划算",
		"authorName": "189*****575",
		"postAt": 1497937621000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "好好好好好",
		"authorName": "182*****937",
		"postAt": 1497933829000,
		"authorAvatar": ""
	}, {
		"score": 3,
		"content": "挺好，就是贵",
		"authorName": "185*****376",
		"postAt": 1497933259000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "还没来得及用，但信赖乐蜂",
		"authorName": "133*****800",
		"postAt": 1497916840000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "还不错哦\n",
		"authorName": "潴婷婷****",
		"postAt": 1498833667000,
		"authorAvatar": "http:\/\/a.vpimg3.com\/upload\/lfapp\/2017\/06\/28\/1\/avatar_qbvu.jpg"
	}, {
		"score": 5,
		"content": "给老婆买的，用了一半了，价格还好比较实惠，有一定美白效果",
		"authorName": "135*****050",
		"postAt": 1498487168000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "朋友说很好用",
		"authorName": "183*****895",
		"postAt": 1498389641000,
		"authorAvatar": ""
	}, {
		"score": 3,
		"content": "还好！！！！",
		"authorName": "135*****425",
		"postAt": 1498487877000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "还没有用活动的时候买的真心便宜",
		"authorName": "qq:****",
		"postAt": 1498279800000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "还可以哦，黑色的今天用了一片，感觉精华比较多，也比较贴合脸的大小，我的脸大，所以短了一点点。第一次用御泥坊的面膜，趁活动买的，感觉挺好的，比较满意",
		"authorName": "150*****520",
		"postAt": 1498214230000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "已经购买很多次了，挺好的",
		"authorName": "184*****926",
		"postAt": 1498139325000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "还行，用惯了功效型的，基础补水还是要用的",
		"authorName": "155*****592",
		"postAt": 1498103977000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "棒棒棒棒哒",
		"authorName": "wei****",
		"postAt": 1498049366000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "还行，精华足够用",
		"authorName": "136*****715",
		"postAt": 1498033283000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "avojxddcvjja",
		"authorName": "150*****017",
		"postAt": 1498005383000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "送给老妈了，补水还行",
		"authorName": "琪大宝****",
		"postAt": 1498000654000,
		"authorAvatar": "http:\/\/a.vpimg3.com\/upload\/lfapp\/2017\/06\/21\/95\/avatar_hvrj.jpg"
	}, {
		"score": 5,
		"content": "便宜实惠，一直在用",
		"authorName": "153*****946",
		"postAt": 1498000516000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "还没开始用，搞活动提前买回囤货的",
		"authorName": "134*****625",
		"postAt": 1497975529000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "挺划算的，趁着活动买的，很实惠，面膜也大都是补水的",
		"authorName": "158*****756",
		"postAt": 1497965833000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "非常满意。",
		"authorName": "139*****613",
		"postAt": 1497922203000,
		"authorAvatar": "http:\/\/a.vpimg3.com\/upload\/lfapp\/2016\/08\/30\/81\/avatar_fern.jpg"
	}, {
		"score": 5,
		"content": "不错，一直用",
		"authorName": "159*****257",
		"postAt": 1497864653000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "很不错。满意",
		"authorName": "135*****966",
		"postAt": 1497790871000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "天天敷绝对有用，感觉皮肤变白了",
		"authorName": "138*****197",
		"postAt": 1497790356000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "很好用，买很多次了",
		"authorName": "184*****926",
		"postAt": 1497768959000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "习惯了用御泥坊",
		"authorName": "186*****335",
		"postAt": 1497750441000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "还没用，看评价还不错",
		"authorName": "136*****007",
		"postAt": 1497696064000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "一直在用啊",
		"authorName": "凉凉****",
		"postAt": 1497685490000,
		"authorAvatar": "http:\/\/a.vpimg3.com\/upload\/lfapp\/2016\/07\/19\/187\/avatar133_uhip.jpg"
	}, {
		"score": 5,
		"content": "非常满意。",
		"authorName": "139*****613",
		"postAt": 1497652694000,
		"authorAvatar": "http:\/\/a.vpimg3.com\/upload\/lfapp\/2016\/08\/30\/81\/avatar_fern.jpg"
	}, {
		"score": 5,
		"content": "还没开始用，用完来补评价",
		"authorName": "158*****065",
		"postAt": 1497583516000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "很不错  实惠   包装完美  正品",
		"authorName": "God刺青爱人",
		"postAt": 1497536036000,
		"authorAvatar": "http:\/\/a.vpimg3.com\/upload\/lfapp\/2017\/06\/12\/119\/avatar_zemj.jpg"
	}, {
		"score": 5,
		"content": "很好哦，一直都用御泥坊，这次活动买的，好超值哦",
		"authorName": "188*****137",
		"postAt": 1497520608000,
		"authorAvatar": "http:\/\/a.vpimg3.com\/upload\/lfapp\/2017\/06\/21\/44\/avatar39_boqv.jpg"
	}, {
		"score": 3,
		"content": "还不错，蛮补水的，",
		"authorName": "157*****245",
		"postAt": 1497518701000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "水水的，夏天太晒了，睡前还是要补一补水的",
		"authorName": "郭郭****",
		"postAt": 1497495027000,
		"authorAvatar": ""
	}, {
		"score": 5,
		"content": "产品的确佷不错",
		"authorName": "135*****579",
		"postAt": 1497444764000,
		"authorAvatar": ""
	}]

	function randomNum(min, max) {
		var num = Math.floor(Math.random() * (max - min + 1)) + min;
		return num;
	}
	//生产一个数组，随机抽取评论数组中20个评论，放进数组中
	function createCom() {
		var arrSelf = [];
		for(i=1;i<=20;i++){
			
			arrSelf.push(arr[randomNum(0,arr.length-1)])
		}
		
		
		return arrSelf
	}

		connection.query(`select gid from goods`,function(err,data){
			//遍历每条商品信息，把生产出来的数组写进数据库
			data.forEach(function(items,i){
				var objStr = JSON.stringify(createCom());
				
				connection.query(`update goods set commentContent = '${objStr}' where gid = ${items.gid}`,function(err,aaa){
					console.log('第'+i+'次写入')
					
				})
			})
		})

})
app.listen(3000, function() {
	console.log('服务器端口：3000')
})