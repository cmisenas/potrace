;(function(exports) {
  var _;
  if (exports._ === undefined && typeof require !== "undefined") {
    _ = require('../js/helpers').Helpers;
  } else {
    _ = exports._;
  }

  //this object is responsible for getting all paths given all the vertices in gathered in the image
  function PathFinder(vertices, imgData) {
    if (typeof vertices == 'undefined') {
      throw new Error('No vertices and image data given!');
    }
    this.allVertices = vertices;
    this.imgData = imgData;
    this.allPaths = [];
    this.count = this.countVertices();
  }

  PathFinder.prototype.followVertex = function (vertex) {
    var currVertex = vertex,
        neighborP = currVertex.getNeighborPixels(this.imgData.width, this.imgData.height),
        neighborV = currVertex.getNeighborVertices(this.imgData.width, this.imgData.height),
        nextVertex;

    if (neighborP.nw !== null && neighborP.ne !== null &&
        this.imgData.data[_.coordsToIndex(neighborP.nw, this.imgData.width, 4)] === 0 &&
        this.imgData.data[_.coordsToIndex(neighborP.ne, this.imgData.width, 4)] === 255) {
      nextVertex = new Vertex(neighborV.n.x, neighborV.n.y);
    } else if (neighborP.ne !== null && neighborP.se !== null &&
        this.imgData.data[_.coordsToIndex(neighborP.ne, this.imgData.width, 4)] === 0 &&
        this.imgData.data[_.coordsToIndex(neighborP.se, this.imgData.width, 4)] === 255) {
      nextVertex = new Vertex(neighborV.e.x, neighborV.e.y);
    } else if (neighborP.se !== null && neighborP.sw !== null &&
        this.imgData.data[_.coordsToIndex(neighborP.se, this.imgData.width, 4)] === 0 &&
        this.imgData.data[_.coordsToIndex(neighborP.sw, this.imgData.width, 4)] === 255) {
      nextVertex = new Vertex(neighborV.s.x, neighborV.s.y);
    } else if (neighborP.sw !== null && neighborP.nw !== null &&
        this.imgData.data[_.coordsToIndex(neighborP.sw, this.imgData.width, 4)] === 0 &&
        this.imgData.data[_.coordsToIndex(neighborP.nw, this.imgData.width, 4)] === 255) {
      nextVertex = new Vertex(neighborV.w.x, neighborV.w.y);
    }

    return nextVertex;
  };

  PathFinder.prototype.countVertices = function () {
    if (typeof this.count === 'undefined') {
      this.count = 0;
      for (var v in this.allVertices) {
        if (this.allVertices.hasOwnProperty(v) && typeof this.allVertices[v] !== 'undefined') {
          this.count++;
        }
      }
    }
    return this.count;
  };

  PathFinder.prototype.getCurrentPath = function () {
    if (typeof this.currPath === 'undefined') {
      this.currPath = new Path(this.imgData);
    }
    return this.currPath;
  };

  PathFinder.prototype.addToPath = function (index) {
    var vertexToAdd = this.allVertices[index];
    delete this.allVertices[index];
    this.count--;
    return this.getCurrentPath().addVertex(vertexToAdd);
  };

  PathFinder.prototype.findAllPaths = function () {
    var path, nextVertex, currVertexInd, currVertexObj;

    while (this.count > 0) {
      for (currVertexInd in this.allVertices) {
        if (this.allVertices.hasOwnProperty(currVertexInd) && typeof this.allVertices[currVertexInd] !== 'undefined') {
          while (this.getCurrentPath().isCircular === false) {
            currVertexObj = this.allVertices[currVertexInd];
            nextVertex = this.followVertex(currVertexObj);
            this.addToPath(currVertexInd);
            currVertexInd = _.coordsToIndex(nextVertex, this.imgData.width, 1);
            if (typeof this.allVertices[currVertexInd] === 'undefined') {
              this.getCurrentPath().isCircular = true;
            }
          }
          this.allPaths.push(this.getCurrentPath());
          delete this.currPath;
        }
      }
    }
  };

  PathFinder.prototype.getAllPaths = function () {
    return this.allPaths;
  };

  //this object is responsible for forming an individual path and is instantiated by PathFinder object
  function Path(imgData){
    this.imgData = imgData;
    this.vertices = [];
    this.isCircular = false;
  }

  Path.prototype.addVertex = function (vertex) {
    if (typeof vertex === 'undefined') {
      throw new Error('No vertex to add to path!');
    }

    if (this.vertices.length > 0 &&
        this.vertices[0].x === vertex.x &&
        this.vertices[0].y === vertex.y) {
      this.isCircular = true;
    }

    if (this.isCircular === true) {
      return false;
    } else if (this.contains(vertex) === true) {
      return false;
    } else {
      this.vertices.push(vertex);
      return true;
    }
  };

  Path.prototype.contains = function (vertex) {
    if (typeof vertex === 'undefined') {
      throw new Error('No vertex to find!');
    }
    if (typeof vertex === 'number') {
      vertex = _.indexToCoords(vertex, this.imgData.width, 1);
    }
    for (var i = 0, max = this.vertices.length; i < max; i++) {
      if (this.vertices[i].x === vertex.x &&
          this.vertices[i].y === vertex.y) {
        return true;
      }
    }
    return false;
  };

  Path.prototype.find = function (vertexIorC) {
    if (typeof vertexIorC === 'undefined') {
      throw new Error('No vertex index or coords provided!');
    }
    if (typeof vertexIorC === 'number') {
      vertexIorC = _.indexToCoords(vertexIorC, this.imgData.width, 1);
    }
    if (this.contains(vertexIorC) === false) {
      return false;
    }
    for (var i = 0, max = this.vertices.length; i < max; i++) {
      if (this.vertices[i].x === vertexIorC.x &&
          this.vertices[i].y === vertexIorC.y) {
        return this.vertices[i];
      }
    }
  };

  exports.PathFinder = PathFinder;
  exports.Path = Path;

}(this));
