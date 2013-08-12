;(function(exports) {
	var loadBtn = document.getElementById('load');
	var canvas = new Canvas('canvas');
	loadBtn.onclick = function() {
		var usrImg = document.getElementById('usrImg').value;
		canvas.loadImg('img/' + usrImg.substr(usrImg.lastIndexOf('\\')));
	}

	var resetBtn = document.getElementById('reset');
	var thresholdBtn = document.getElementById('threshold');

	var filters = new Filters(canvas);
	exports.filters = filters;

	thresholdBtn.onclick = function() {
		var currentImgData = canvas.ctx.getImageData(0, 0, canvas.elem.width, canvas.elem.height);
		var newImgData = filters.threshold(currentImgData);
		canvas.ctx.putImageData(newImgData, 0, 0);
	}

	resetBtn.onclick = function() {
		canvas.ctx.putImageData(canvas.currentImg.imgData, 0, 0);//put back the original image to the canvas
	}
}(this));
