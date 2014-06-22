;(function(exports) {
  var Helpers = {
    coordsToIndex: function(coords, width, m) {
      return (coords.x * m) + (coords.y * width * m);
    },
    indexToCoords: function(index, width, m) {
      //coordinates are always going to be the top left corner of a pixel
      return {
              x : (index % (width * m)) / m,
              y : Math.floor(index / (width * m))
             };
    }
  };
  exports.Helpers = Helpers;
}(this));

