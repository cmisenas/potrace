;(function(exports) {
  var _;
  if (exports._ === undefined &&
      typeof require !== "undefined") {
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
    if (typeof imgData == 'undefined') {
      throw new Error('No image data passed!');
    }

    this.imgData = imgData;
    this.allVertices = [];
    this.vLength = 0;
  }

  VertexFinder.prototype.addVertex = function (vertex) {
    var index = _.coordsToIndex(vertex, this.imgData.width, 1);
    this.allVertices[index] = vertex
    this.vLength++;
    return true;
  };

  VertexFinder.prototype.findAllVertices = function () {
    var vertex;
    for (var y = 0; y < this.imgData.height; y++) {
      for (var x = 0; x < this.imgData.width; x++) {
        vertex = new Vertex(x, y);
        if (vertex.checkIfEdge(this.imgData) === true) {
          this.addVertex(vertex);
        }
      }
    }
  };

  //this object will be handling individual vertex particularly determining if a vertex is an edge or not
  function Vertex(x, y) {
    if (typeof x == 'undefined' || typeof y == 'undefined') {
      throw new Error('No x and y passed!');
    }

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

    // to get to [direction] the following neighbor pixels need to be [white|black]
    // NORTH: { NW: BLACK, NE: WHITE }
    // EAST:  { NE: BLACK, SE: WHITE }
    // SOUTH: { SE: BLACK, SW: WHITE }
    // WEST:  { SW: BLACK, NW: WHITE }
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
        neighborCount = 4, // there will always be 4 neighbors for every vertex
        neighborVals = Object.keys(neighbors).map(function(n) { return neighbors[n]; }),
        currPixel, otherPixel, currVal, compareVal;

    for (var i = 0; i < neighborCount; i++) {
      currVal = _.isNumeric(neighborVals[i]) ? neighborVals[i] : imgData.data[_.coordsToIndex(neighborVals[i], imgData.width)];
      for (var j = i + 1; j < neighborCount; j++) {
        compareVal = _.isNumeric(neighborVals[j]) ? neighborVals[j] : imgData.data[_.coordsToIndex(neighborVals[j], imgData.width)];
        if (currVal !== compareVal) {
          return true;
        }
      }
    }

    return false;
  };

  exports.VertexFinder = VertexFinder;
  exports.Vertex = Vertex;

}(this));
