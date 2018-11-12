var file = require("../models/file.js");
var formidable = require("formidable");
var path = require("path");
var fs = require("fs");
var sd = require("silly-datetime");
exports.showIndex = function (req, res, next) {
    file.getAllAlbums(function (err, allAlbums) {
        if (err) {
            next();
            return;
        }
        res.render("index", {
            "albums": allAlbums
        });
    })
};

// 相册页
exports.showAlbum = function (req, res, next) {
    // 遍历相册中的所有图片
    var albumName = req.params.albumName;
    // 具体业务交给model
    file.getAllImagesByAlbumName(albumName, function (err, imagesArray) {
        if (err) {
            next();
            return;
        }
        res.render("album", {
            "albumname": albumName,
            "images": imagesArray
        });
    });
};

exports.loadFile = function (req, res) {
    var file = req.params["file"];
    var name = req.params["name"];
    res.sendFile("../public/" + file + "/" + name);
}
// 显示上传页面
exports.showUp = function (req, res) {
    file.getAllAlbums(function (err, albums) {
        res.render("up", {
            albums: albums
        });
    })
}
// 显示添加相册页面
exports.showAdd = function (req, res) {
    res.render("add");
}
// 显示删除相册页面
exports.showDel = function (req, res) {
    file.getAllAlbums(function (err, albums) {
        res.render("del", {
            albums: albums
        });
    })
}

// 删除目录
exports.delDir = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files, next) {
        console.log(fields);
        console.log(files);
        if (err) {
            next();//这个中间件不受理这个请求了，往下走
            return;
        };
        var wenjianjia = fields.wenjianjia;
        var delPath = path.normalize(__dirname + "/../uploads/" + wenjianjia);
        fs.exists(delPath, function (exists) {
            if (exists) {
                fs.rmdir(delPath, function (err) {
                    if (err) {
                        res.render("jump", { msg: "文件夹中有图片，删除失败，请先删除图片" });
                    }
                    res.render("jump", { msg: " " ,flag:""});
                })
            } else {
                res.send("文件夹不存在");
            }
        })
    })
}


// 添加目录
exports.addDir = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files, next) {
        console.log(fields);
        console.log(files);
        if (err) {
            next();//这个中间件不受理这个请求了，往下走
            return;
        };
        // 添加目录
        var newfile = fields.newfile;
        var filename = path.normalize(__dirname + "/../uploads/" + newfile);
        fs.exists(filename, function (exists) {
            if (exists) {
                res.render("jump", { msg: "文件夹已经存在" });
            } else {
                fs.mkdir(filename, function (err) {
                    if (err) {
                        throw err;
                    }
                    res.render("jump", { msg: "" ,flag:newfile});
                })
            }
        })
    })
}
// 上传表单
exports.doPost = function (req, res) {
    var form = new formidable.IncomingForm();

    // 设置图片临时存储地址
    form.uploadDir = path.normalize(__dirname + "/../tempup/");
    form.parse(req, function (err, fields, files, next) {
        console.log(fields);
        console.log(files);
        if (err) {
            next();//这个中间件不受理这个请求了，往下走
            return;
        };

        // 判断文件尺寸
        var size = parseInt(files.tupian.size);
        if (size > 2000000) {
            res.send("图片尺寸应该小于2M");
            // 删除这个文件
            fs.unlink("files.tupian.path", function () {
            });
            return;
        }
        var wenjianjia = fields.wenjianjia;
        var oldpath = files.tupian.path;
        // 加时间戳
        var ttt = sd.format(new Date(), "YYYMMDDHHmmss");
        var ran = parseInt(Math.random() * 89999 + 10000);
        var extname = path.extname(files.tupian.name);
        var newpath = path.normalize(__dirname + "/../uploads/" + wenjianjia + "/" + ttt + ran + extname);
        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                throw err;
            }
            res.render("jump", { msg: "" ,flag:wenjianjia});
        });
    });
}

// 删除照片
exports.doDels = function (req, res) {
    var path = req.params['path'];
    var fileName = req.params['fileName'];
    fs.unlinkSync("./uploads/" + path + "/" + fileName, function (err) {
        // if (err) {
        //     res.send('0', );
        // }
        // res.send('1', {"root": __dirname});
    })
    res.render("jump", { msg: "删除成功!",flag: path }); 
}