;(function(exports) {
  var Helpers = {
    BLACK: 0,
    WHITE: 255,

    coordsToIndex: function(coords, width, m) {
      if (m == undefined) { m = 4; } // set multiple equal to 4
      // refers to how much data is stored in a pixel
      // the 4 default is how image data is stored in html canvas
      // 1 for Red value, 1 for Green value, 1 for Blue value & 1 for Alpha (opacity)
      return (coords.x * m) + (coords.y * width * m);
    },
    indexToCoords: function(index, width, m) {
      //coordinates are always going to be the top left corner of a pixel
      return {
              x : (index % (width * m)) / m,
              y : Math.floor(index / (width * m))
             };
    },

    isBlack: function(val) {
      return val === this.BLACK;
    },
    isWhite: function(val) {
      return val === this.WHITE;
    },

    countElements: function (obj) {
      var count = 0;
      for (var el in obj) {
        count++;
      }
      return count;
    },
  };
  exports.Helpers = Helpers;
}(this));

