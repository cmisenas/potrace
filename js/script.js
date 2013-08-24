;(function (exports) {
	var loadBtn = document.getElementById('load'),
	    canvas = new Canvas('canvas'),
	    filters = new Filters(canvas),
      vertexFinder, vertices, pathFinder, paths;

	var resetBtn = document.getElementById('reset'),
	    thresholdBtn = document.getElementById('threshold'),
      getVerticesBtn = document.getElementById('vertices'),
      getPathBtn = document.getElementById('path');

	loadBtn.onclick = function () {
		var usrImg = document.getElementById('usrImg').value;
		canvas.loadImg('img/' + usrImg.substr(usrImg.lastIndexOf('\\')));
    resetBtn.disabled = false;
    thresholdBtn.disabled = false;
	};

	thresholdBtn.onclick = function () {
		var currentImgData = canvas.ctx.getImageData(0, 0, canvas.elem.width, canvas.elem.height);
		var newImgData = filters.threshold(currentImgData);
		canvas.ctx.putImageData(newImgData, 0, 0);
    vertexFinder = new VertexFinder(newImgData);
    getVerticesBtn.disabled = false;
	};

  getVerticesBtn.onclick = function () {
    vertexFinder.findAllVertices();
    vertices = vertexFinder.getAllVertices();
    pathFinder = new PathFinder(vertices, vertexFinder.imgData);
    getPathBtn.disabled = false;
  };

  getPathBtn.onclick = function () {
    pathFinder.findAllPaths();
    paths = pathFinder.getAllPaths();
    exports.paths = paths;
  };

	resetBtn.onclick = function() {
		canvas.ctx.putImageData(canvas.currentImg.imgData, 0, 0);//put back the original image to the canvas
	};
}(this));
