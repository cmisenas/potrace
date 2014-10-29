;(function(exports) {
  var _;
  if (exports._ === undefined && typeof require !== "undefined") {
    _ = require('../js/helpers').Helpers;
  } else {
    _ = exports._;
  }

  /*
   * Iterate through the canvas image vertex (NW point)
   * Check each one if it is an edge based on the condition that all four neighbors are not equal in value
   */

  //this object will be responsible for finding all vertices given a canvas image
  function VertexFinder (imgData) {
    if (typeof imgData == 'undefined') { throw new Error('No image data passed!'); }

    this.imgData = imgData;
    this.allVertices = [];
    this.vLength = 0;
  }

  VertexFinder.prototype.addVertex = function (vertex) {
    if (typeof vertex === "undefined" || vertex === null) { return false; }

    var index = _.coordsToIndex({x: vertex.x, y: vertex.y}, this.imgData.width, 1);
    this.allVertices[index] = vertex
    this.vLength++;
    return true;
  };

  VertexFinder.prototype.findAllVertices = function () {
    var vertex;
    for (var y = 0, maxH = this.imgData.height; y <= maxH; y++) {
      for (var x = 0, maxW = this.imgData.width; x <= maxW; x++) {
        vertex = new Vertex(x, y);
        if (vertex.checkIfEdge(this.imgData) === true) {
          this.addVertex(vertex);
        }
      }
    }
  };

  //this object will be handling individual vertex particularly determining if a vertex is an edge or not
  function Vertex(x, y) {
    if (typeof x == 'undefined' || typeof y == 'undefined') { throw new Error('No x and y passed!'); }

    this.x = x;
    this.y = y;
  }

  Vertex.prototype.neighborPixelCoords = function (width, height) {
    var neighbors = {};
    var checkedIfBorder = this.checkIfBorder(width, height);

    neighbors.nw = checkedIfBorder.top || checkedIfBorder.left ? _.WHITE : {x: this.x - 1, y: this.y - 1};
    neighbors.ne = checkedIfBorder.top || checkedIfBorder.right ? _.WHITE : {x: this.x, y: this.y - 1};
    neighbors.sw = checkedIfBorder.bottom || checkedIfBorder.left ? _.WHITE : {x: this.x - 1, y: this.y};
    neighbors.se = checkedIfBorder.bottom || checkedIfBorder.right ? _.WHITE : {x: this.x, y: this.y};
    return neighbors;
  };

  Vertex.prototype.neighborVertexCoords = function (width, height) {
    var neighbors = {};
    var checkedIfBorder = this.checkIfBorder(width, height);

    neighbors.n = checkedIfBorder.top ? null : {x: this.x, y: this.y - 1};
    neighbors.s = checkedIfBorder.bottom ? null : {x: this.x, y: this.y + 1};
    neighbors.e = checkedIfBorder.right ? null : {x: this.x + 1, y: this.y};
    neighbors.w = checkedIfBorder.left ? null : {x: this.x - 1, y: this.y};
    return neighbors;
  };

  Vertex.prototype.getNextVertex = function (imgData) {
    var neighborP = this.neighborPixelCoords(imgData.width, imgData.height),
        neighborV = this.neighborVertexCoords(imgData.width, imgData.height),
        nextVertex;

    if (this._isAVertex(neighborP.nw, neighborP.ne, imgData)) {
      nextVertex = new Vertex(neighborV.n.x, neighborV.n.y);
    } else if (this._isAVertex(neighborP.ne, neighborP.se, imgData)) {
      nextVertex = new Vertex(neighborV.e.x, neighborV.e.y);
    } else if (this._isAVertex(neighborP.se, neighborP.sw, imgData)) {
      nextVertex = new Vertex(neighborV.s.x, neighborV.s.y);
    } else if (this._isAVertex(neighborP.sw, neighborP.nw, imgData)) {
      nextVertex = new Vertex(neighborV.w.x, neighborV.w.y);
    }

    return nextVertex;
  };

  Vertex.prototype._isAVertex = function(neighborPixel1, neighborPixel2, imgData) {
    var nPixel1Coords = _.coordsToIndex(neighborPixel1, imgData.width),
        nPixel2Coords = _.coordsToIndex(neighborPixel2, imgData.width);
    return (neighborPixel1 !== null && neighborPixel2 !== null &&
           _.isBlack(imgData.data[nPixel1Coords]) && _.isWhite(imgData.data[nPixel2Coords]));
  }

  Vertex.prototype.checkIfBorder = function (width, height) {
    var borders = {};
    borders.top = _.isBlack(this.y) ? true : false;
    borders.bottom = this.y === height ? true : false;
    borders.left = _.isBlack(this.x) ? true : false;
    borders.right = this.x === width ? true : false;
    return borders;
  };

  Vertex.prototype.checkIfEdge = function (imgData) {
    var neighbors = this.neighborPixelCoords(imgData.width, imgData.height),
        currPixel, otherPixel;

    for (currPixel in neighbors) {
      var valToCompare = typeof neighbors[currPixel] === 'number' ? neighbors[currPixel] : imgData.data[_.coordsToIndex(neighbors[currPixel], imgData.width)];
      for (otherPixel in neighbors) {
        if (currPixel !== otherPixel) {
          var otherValToCompare = typeof neighbors[otherPixel] === 'number' ? neighbors[otherPixel] : imgData.data[_.coordsToIndex(neighbors[otherPixel], imgData.width)];
          if (valToCompare !== otherValToCompare) {
            return true;
          }
        }
      }
    }

    return false;
  };

  exports.VertexFinder = VertexFinder;
  exports.Vertex = Vertex;

}(this));
