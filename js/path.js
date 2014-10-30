;(function(exports) {
  var _;
  if (exports._ === undefined && typeof require !== "undefined") {
    _ = require('../js/helpers').Helpers;
  } else {
    _ = exports._;
  }

  //this object is responsible for getting all paths given all the vertices in gathered in the image
  function PathFinder(vertices, imgData, vertexBuilderClass) {
    if (typeof vertices == 'undefined') { throw new Error('No vertices and image data given!'); }

    this.allVertices = vertices;
    this.imgData = imgData;
    this.allPaths = [];
    this.count = this.countVertices();
    this.VertexBuilder = vertexBuilderClass || exports.Vertex;
  }

  PathFinder.prototype.countVertices = function () {
    if (typeof this.count === 'undefined') {
      this.count = 0;
      for (var v in this.allVertices) {
        if (this.allVertices[v]) { this.count++; }
      }
    }
    return this.count;
  };

  PathFinder.prototype.getCurrentPath = function () {
    if (typeof this.currPath === 'undefined') { this.currPath = new Path(this.imgData); }
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
        if (typeof this.allVertices[currVertexInd] !== 'undefined') {
          while (this.getCurrentPath().isCircular === false) {
            currVertexObj = this.allVertices[currVertexInd];
            nextVertex = currVertexObj.getNextVertex(this.imgData);
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

  //this object is responsible for forming an individual path and is instantiated by PathFinder object
  function Path(imgData){
    this.imgData = imgData;
    this.vertices = [];
    this.isCircular = false;
  }

  Path.prototype.addVertex = function (vertex) {
    if (typeof vertex === 'undefined') { throw new Error('No vertex to add to path!'); }

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
    if (typeof vertex === 'undefined') { throw new Error('No vertex to find!'); }

    var match = this.find(vertex);
    return (typeof match !== "undefined" && match !== null);
  };

  Path.prototype.find = function (vertexIorC) {
    if (typeof vertexIorC === 'undefined') { throw new Error('No vertex index or coords provided!'); }

    var vertexIndex = vertexIorC;
    if (_.isNumeric(vertexIorC)) { vertexIndex = _.indexToCoords(vertexIorC, this.imgData.width, 1); }
    for (var i = 0, max = this.vertices.length; i < max; i++) {
      if (this.vertices[i].x === vertexIndex.x &&
          this.vertices[i].y === vertexIndex.y) {
        return this.vertices[i];
      }
    }
  };

  exports.PathFinder = PathFinder;
  exports.Path = Path;

}(this));
