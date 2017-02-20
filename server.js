/*
    啟動Web Server的模組,任何與express有關或是欲使用的模組都放在server
*/
/*
    express模組:提供Routing機制，可讓我們用get()、post()方法
    自訂Routing和對應的處理函數，不須再自己解析URL路徑
    ex: app.get('/myRoute', 處理函數callback)
*/
/*
    1.載入資源
*/
var express = require('express');
//所有模組的APi Manager
var app = express();
var morgan = require('morgan'); //自己查
var bodyParser = require('body-parser'); //自己查
var timeout = require('connect-timeout');
//HeroKu網路空間的port,若找不到會取預設值(3000)
var port = process.env.PORT || 3000;



var apiRoutes = require('./api/api_member'); //import api_member
var apiRoutes2 = require('./api/api_sleepTime'); //import api_member
//設定路徑('./')開頭表示為本機實體路徑
//備註:記得將app傳入給予routes檔使用
require('./app/routes.js')(app); //controller:依據url取得對應資料
//將database.js載入進來，連接db
require('./config/database.js'); //DB
/*
    2.使用資源
*/
//設定timout時間
app.use(timeout('50s'));

//於console中顯示出request 用戶請求路徑
app.use(morgan('dev'));

//可以接收post請求
app.use(bodyParser.json());     //可處理、解析JSON格式的資料
app.use(bodyParser.urlencoded({ //可處理表單的資料
    extended: true,
}));
//預設是private
//express.static設定靜態檔案，告訴瀏覽器只能"存取"該路徑底下的靜態檔案，若沒有宣告，預設是關閉無法存取。
//_dirname:專案路徑下
app.use(express.static(__dirname + '/public'));


app.use('/api', apiRoutes);
app.use('/api2', apiRoutes2);


//監聽port
app.listen(port, function () {
    console.log('Server is running on port ' + port + '..');
});