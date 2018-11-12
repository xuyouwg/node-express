var  express = require("express");
var app = express();
// 跨域
var cors = require('cors'); 
app.use(cors()); 
// 控制器
var router = require("./controller/router.js");
// 设置模板引擎
app.set("view engine","ejs");
// 路由中间件  静态页面
app.use(express.static("./public"));
app.use(express.static("./uploads"));
// 首页
app.get("/",router.showIndex);
// 图片展示页
app.get("/:albumName",router.showAlbum);

app.get("/:file/:name",router.loadFile);
// 上传页
app.get("/up",router.showUp);
// 添加相册页
app.get("/add",router.showAdd);
// 删除相册页
app.get("/del",router.showDel);
// 执行上传图片
app.post("/up",router.doPost);
// 执行添加相册
app.post("/add",router.addDir);
// 执行删除相册
app.post("/del",router.delDir);
// 执行删除照片
app.get("/dels/:path/:fileName",router.doDels);

// 404
app.use(function(req,res){
    res.render("err");
});
app.listen(3000);
