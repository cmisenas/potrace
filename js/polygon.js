;(function (exports) {
  if (!exports.StraightLine) { throw Error("StraightLine is not defined"); }
  StraightLine = exports.StraightLine;

  function Polygon(path) {
    this.path = path;
    this.polygon = { vertices: [] };
  }

  Polygon.prototype.build = function() {
    // the first 3 vertices are always straight
    var currentLine = this.init(0);

    for (var i = 3; i < this.path.vertices.length; i++) {
      currentLine.push(this.path.vertices[i]);
      if (!StraightLine.isStraight(currentLine)) {
        currentLine.pop();
        this.polygon.vertices.push(currentLine.shift());
        this.polygon.vertices.push(currentLine.pop());
        // if the vertices left is less than 3, we just consider them as part of first line
        if (i + 2 > this.path.vertices.length && this.path.isCircular) {
          this.polygon.vertices[0] = this.path.vertices[i];
          break;
        } else {
          currentLine = this.init(i);
          i+= 2;
        }
      }
    }
    return this.polygon;
  };

  Polygon.prototype.init = function(index) {
    var line = [];
    line.push(this.path.vertices[index]);
    line.push(this.path.vertices[index + 1]);
    line.push(this.path.vertices[index + 2]);
    return line;
  };

  exports.Polygon = Polygon;

}(this));
