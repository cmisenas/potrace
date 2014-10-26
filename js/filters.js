;(function(exports) {
  var _;
  if (exports._ === undefined && typeof require !== "undefined") {
    _ = require('../js/helpers').Helpers;
  } else {
    _ = exports._;
  }

  function Filters(cvs) {
    var canvas = cvs,
        // use the coefficients from YUV and YIQ models used by PAL and NTSC to calculate grayscale value of a pixel
        rCoefficient = 0.3,
        gCoefficient = 0.59,
        bCoefficient = 0.11;


    this.threshold = function(imgData, t) {
      var self = this;
      var imgDataCopy = canvas.copyImageData(imgData);
      var threshold = typeof t === 'undefined' ? 100 : t; //default threshold
      canvas.runImg(null, function(current) {
        var grayLevel = self._calculateGrayLevel(imgData.data[current], imgData.data[current + 1], imgData.data[current + 2]);
        if (grayLevel >= threshold) {
          canvas.setPixel(current, _.WHITE, imgDataCopy);
        } else {
          canvas.setPixel(current, 0, imgDataCopy);
        }
      });
      return imgDataCopy;
    };

    this.grayscale = function(imgData) {
      var self = this;
      var imgDataCopy = canvas.copyImageData(imgData);
      canvas.runImg(null, function(current) {
        var grayLevel = self._calculateGrayLevel(imgData.data[current], imgData.data[current + 1], imgData.data[current + 2]);
        canvas.setPixel(current, grayLevel, imgDataCopy);
      });
      return imgDataCopy;
    };

    this._calculateGrayLevel = function(rVal, gVal, bVal) {
      return (rVal * rCoefficient) + (gVal * gCoefficient) + (bVal * bCoefficient);
    }

  }

  exports.Filters = Filters;

}(this));
