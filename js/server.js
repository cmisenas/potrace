var http = require('http'),
    fs = require('fs'),
    url = require('url');

var serveStaticFile = function(filename, type, res) {
  fs.readFile(filename, function (err1, data1) {
    if (data1) {
      res.writeHead(200, { 'Content-Type': type });
      res.end(data1);
    } else {
      serveErrorPage(res);
    }
  });
};

var serveErrorPage = function(res) {
  fs.readFile('error.html', 'utf8', function (err2, data2){
    res.writeHead(404);
    if (err2) {
      res.end('File Not Found!');
    } else {
      res.end(data2);
    }
  });
}


var startServer = function() {
  var PORT = 8000;
  var app = http.createServer(function(req, res){
	  var pathname = url.parse(req.url).pathname;
	  if (pathname == '/') {
      serveStaticFile('index.html', 'text/html', res);
    } else {
      var type = pathname.indexOf('.js') > -1 ? 'text/javascript' :
                 pathname.indexOf('.html') > -1 ? 'text/html' :
                 pathname.indexOf('.css') > -1 ? 'text/css' :
                 pathname.indexOf('.png') > -1 ? 'image/png' :
                 pathname.indexOf('.jpg') > -1 || pathname.indexOf('.jpeg') > -1 ? 'image/jpg' :
                 'text/plain';
      serveStaticFile(pathname.substring(1), type, res);
	  }
  }).listen(PORT);
  console.log("Server started on port", PORT);
  return app;
};

startServer();
