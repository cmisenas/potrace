;(function(exports) {

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

  PathFinder.prototype.followVertex = function (vertexIndex) {
    var currVertex = this.allVertices[vertexIndex],
        neighborP = currVertex.getNeighborPixels(this.imgData.width, this.imgData.height),
        neighborV = currVertex.getNeighborVertices(this.imgData.width, this.imgData.height),
        nextVertex;

    if (neighborP.nw !== null && neighborP.ne !== null &&
        this.imgData.data[coordsToIndex(neighborP.nw, this.imgData.width, 4)] === 0 &&
        this.imgData.data[coordsToIndex(neighborP.ne, this.imgData.width, 4)] === 255) {
      nextVertex = new Vertex(neighborV.n.x, neighborV.n.y);
    } else if (neighborP.ne !== null && neighborP.se !== null &&
        this.imgData.data[coordsToIndex(neighborP.ne, this.imgData.width, 4)] === 0 &&
        this.imgData.data[coordsToIndex(neighborP.se, this.imgData.width, 4)] === 255) {
      nextVertex = new Vertex(neighborV.e.x, neighborV.e.y);
    } else if (neighborP.se !== null && neighborP.sw !== null &&
        this.imgData.data[coordsToIndex(neighborP.se, this.imgData.width, 4)] === 0 &&
        this.imgData.data[coordsToIndex(neighborP.sw, this.imgData.width, 4)] === 255) {
      nextVertex = new Vertex(neighborV.s.x, neighborV.s.y);
    } else if (neighborP.sw !== null && neighborP.nw !== null &&
        this.imgData.data[coordsToIndex(neighborP.sw, this.imgData.width, 4)] === 0 &&
        this.imgData.data[coordsToIndex(neighborP.nw, this.imgData.width, 4)] === 255) {
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
    var path, nextVertex, currVertex;
  
    while (this.count > 0) {
      for (currVertex in this.allVertices) {
        if (this.allVertices.hasOwnProperty(currVertex) && typeof this.allVertices[currVertex] !== 'undefined') {
          while (this.getCurrentPath().isCircular === false) {
            nextVertex = this.followVertex(currVertex);
            this.addToPath(currVertex);
            currVertex = coordsToIndex(nextVertex, this.imgData.width, 1);
            if (typeof this.allVertices[currVertex] === 'undefined') {
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
      vertex = indexToCoords(vertex, this.imgData.width, 1);
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
      vertexIorC = indexToCoords(vertexIorC, this.imgData.width, 1);
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

  function indexToCoords(index, width, m) {
    //coordinates are always going to be the top left corner of a pixel
    return {
            x : (index % (width * m)) / m,
            y : Math.floor(index / (width * m))
           };
  }

  function coordsToIndex (coords, width, m) {
    return (coords.x * m) + (coords.y * width * m);  
  }

  exports.PathFinder = PathFinder;
  exports.Path = Path;

}(this));
