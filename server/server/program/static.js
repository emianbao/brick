/**
 * 静态文件处理
 */
var config = require("../config"),
	mime = require("../mime"),
	fs = require("fs"),
	zlib = require("zlib"),
	seajs = require("./seajs");

module.exports = function(request, response, other){
	fs.exists(other.realPath, function (exists) {
        if (!exists) {
			// 文件不存在
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write("This request URL " + other.pathName + " was not found on this server.");
            response.end();
        } else {
			// 读取文件
			fs.stat(other.realPath, function (err, stat) {
				if(err) {
					// 读取错误
					response.writeHead(500, {
						'Content-Type': 'text/plain'
					});

					response.end(err);
				} else {
					var lastModified = stat.mtime.toUTCString();
					// 文件未修改
					if (lastModified === request.headers["if-modified-since"]) {
						response.writeHead(304, "Not Modified");
						response.end();
					}
					else
					{
						// 检测缓存时间
						if (config.cache.match.test(other.ext)) {
							var expires = new Date();
							expires.setTime(expires.getTime() + config.cache.maxAge * 1000);
							response.setHeader("Expires", expires.toUTCString());
							response.setHeader("Cache-Control", "max-age=" + config.cache.maxAge);
							response.setHeader("Last-Modified", lastModified);
						}
						var contentType = mime[other.ext] || "text/plain";
						// 设置文件类型
						response.setHeader("Content-Type", contentType);
						
						var raw = fs.createReadStream(other.realPath);
						var acceptEncoding = request.headers['accept-encoding'] || "";
						var matched = other.ext.match(config.gzip.match);
						var gzip;
						if(other.seajs && other.ext !== "js"){
							other.seajs = false;
						}
						// gzip压缩
						if (matched && acceptEncoding.match(/\bgzip\b/)) {
							response.writeHead(200, "Ok", {
								'Content-Encoding': 'gzip'
							});
							gzip = zlib.createGzip();
							if(other.seajs){
								gzip.write(seajs.header);
								raw.on("end", function() {
								  	gzip.write(seajs.footer);
								});
							}
							raw.pipe(gzip).pipe(response);
						} else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
							response.writeHead(200, "Ok", {
								'Content-Encoding': 'deflate'
							});
							gzip = zlib.createDeflate();
							if(other.seajs){
								gzip.write(seajs.header);
								raw.on("end", function() {
								  	gzip.write(seajs.footer);
								});
							}
							raw.pipe(gzip).pipe(response);
						} else {
							response.writeHead(200, "Ok");
							if(other.seajs){
								response.write(seajs.header);
								raw.pipe(response, { end: false });
								raw.on("end", function() {
								  	response.write(seajs.footer);
								  	response.end();
								});
							}else{
								raw.pipe(response);
							}
						}
					}
				}
			});
        }
    });
};