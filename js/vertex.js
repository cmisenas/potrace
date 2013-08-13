;(function(exports) {
  
  /*
   * Iterate through the canvas image vertex (NW point)
   * Check each one if it is an edge based on the condition that all four neighbors are not equal in value
   */
  
  //this object will be responsible for finding all vertices given a canvas image
  function VertexFinder(canvas) {
  }

  VertexFinder.prototype.getAllVertices = function() {
  }

  //this object will be handling individual vertex particularly determining if a vertex is an edge or not
  function Vertex(x, y) {
    this.x = x;
    this.y = y;
  }

  Vertex.prototype.getNeighbors = function(width, height, coords) {
    var neighbors = {};
    neighbors.nw = coordsToIndex(width, height, {x: coords.x - 1, y: coords.y - 1});
    neighbors.ne = coordsToIndex(width, height, {x: coords.x, y: coords.y - 1});
    neighbors.sw = coordsToIndex(width, height, {x: coords.x - 1, y: coords.y});
    neighbors.se = coordsToIndex(width, height, {x: coords.x, y: coords.y});
    return neighbors;
  }

  Vertex.prototype.checkIfEdge = function(imgData) {
    var neighbors = getNeighbors(imgData.width,
                                 imgData.height,
                                 {x: thix.x, y: this.y});
    return (imgData.data[neighbors.nw] ===  imgData.data[neighbors.ne] &&
            imgData.data[neighbors.sw] ===  imgData.data[neighbors.se] &&
            imgData.data[neighbors.nw] ===  imgData.data[neighbors.ne]) ? true : false;
  }

}(this));
