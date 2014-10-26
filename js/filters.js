;(function(exports) {
  var _;
  if (exports._ === undefined && typeof require !== "undefined") {
    _ = require('../js/helpers').Helpers;
  } else {
    _ = exports._;
  }

  function Filters(cvs) {
    var canvas = cvs;

    this.threshold = function(imgData, t) {
      var imgDataCopy = canvas.copyImageData(imgData);
      var threshold = typeof t === 'undefined' ? 100 : t; //default threshold
      canvas.runImg(null, function(current) {
        var grayLevel = (0.3 * imgData.data[current]) + (0.59 * imgData.data[current + 1]) + (0.11 * imgData.data[current + 2]);
        if (grayLevel >= threshold) {
          canvas.setPixel(current, _.WHITE, imgDataCopy);
        } else {
          canvas.setPixel(current, 0, imgDataCopy);
        }
      });
      return imgDataCopy;
    };

    this.grayscale = function(imgData) {
      var imgDataCopy = canvas.copyImageData(imgData);
      canvas.runImg(null, function(current) {
        var grayLevel = (0.3 * imgData.data[current]) + (0.59 * imgData.data[current + 1]) + (0.11 * imgData.data[current + 2]);
        canvas.setPixel(current, grayLevel, imgDataCopy);
      });
      return imgDataCopy;
    };

  }

  exports.Filters = Filters;

}(this));
