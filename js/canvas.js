;(function(exports) {
	
	function Canvas(id, w, h, res) {
		this.elem = document.getElementById(id);
		this.width = w || 600;
		this.height = h || 400;
		if (this.elem === null) {
			this.elem = document.createElement('canvas');
			this.elem.id = id;
			this.elem.width = this.width;
			this.elem.height = this.height;
			document.body.insertBefore(this.elem, document.body.firstChild);
		}
		this.ctx = this.elem.getContext('2d');
		this.images = [];
		this.currentImg = {};
	}

	Canvas.prototype.loadImg = function(img, sx, sy) {
		this.images.push(img);
		this.currentImg.index = this.images.indexOf(img);
		
		var that = this;
		var usrImg = new Image();
		usrImg.onload = function() {
			if (usrImg.width !== that.width || usrImg.height !== that.height) {
				that.width = usrImg.width;
				that.height = usrImg.height;
				that.elem.width = that.width;
				that.elem.height = that.height;
			}
			that.ctx.drawImage(usrImg, sx || 0, sy || 0);
			that.currentImg.imgData = that.ctx.getImageData(0, 0, that.elem.width, that.elem.height);
		}
		usrImg.src = img;
	}

	Canvas.prototype.runImg = function(size, fn) {
		var that = this;

		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				var matrix = getMatrix(x, y, size);
				fn(coordsToIndex(this.width, this.height, {x: x, y: y}), matrix);
			}
		}
		
		function getMatrix(cx, cy, size) {//will generate a 2d array of sizexsize given center x, center y, size, image width & height
			var matrix = [];
			for (var i = 0, y = -(size-1)/2; i < size; i++, y++) {
				matrix[i] = [];
				for (var j = 0, x = -(size-1)/2; j < size; j++, x++) {
					matrix[i][j] = coordsToIndex(that.width, that.height, {x: cx + x, y: cy + y});
				}
			}
			return matrix;
		}
	}

	Canvas.prototype.copyImageData = function(src) {
		var dst = this.ctx.createImageData(src.width, src.height);
		dst.data.set(src.data);
		return dst;
	}

	Canvas.prototype.setPixel = function(i, val, imgData) {
		imgData.data[i] = typeof val == 'number'? val: val.r;
		imgData.data[i + 1] = typeof val == 'number'? val: val.g;
		imgData.data[i + 2] = typeof val == 'number'? val: val.b;
	}

	Canvas.prototype.getPixel = function(i, imgData) {
		if (i < 0 || i > imgData.data.length - 4) {
			return {r: 255, g: 255, b: 255, a: 255};
		} else {
			return {r: imgData.data[i], g: imgData.data[i + 1], b: imgData.data[i + 2], a: imgData.data[i + 3] };
		}
	}
  
  function coordsToIndex(width, height, coords) {
		return coords.x * 4 + coords.y * width * 4;
  }

  function indexToCoords(width, height, index) {
    return {x: (index % (width * 4)) / 4,
            y: Math.floor(index / (width * 4))};
  }

	exports.Canvas = Canvas;
  exports.coordsToIndex = coordsToIndex;
  exports.indexToCoords = indexToCoords;

}(this));
