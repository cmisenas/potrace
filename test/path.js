var assert = require('assert'),
    PathFinder = require('../js/path').PathFinder,
    Path = require('../js/path').Path;

var objTests = {
      pathFinder: null,
      path: null
    },
    Vertex,
    vertices = [],
    bigVertices = [],
    verticesIndices,
    bigVerticesIndices,
    blankImgData = {},
    sqrImgData = {},
    twoSqrImgData = {};

function indexToCoords(i, w, m) {
  //coordinates are always going to be the top left corner of a pixel
  return {
          x : (i % (w * m)) / m,
          y : Math.floor(i / (w * m))
         };
}

function coordsToIndex (coords, width, m) {
  return (coords.x * m) + (coords.y * width * m);
}


describe('Path Finder', function() {
  setup(function () {
    Vertex = function (coords) {
      this.x = coords.x;
      this.y = coords.y;
    };

    Vertex.prototype = {
      getNeighborPixels : function (width, height) {
        var neighbors = {};
        var checkedIfBorder = this.checkIfBorder(width, height);

        neighbors.nw = checkedIfBorder.top || checkedIfBorder.left ? null : {x: this.x - 1, y: this.y - 1};
        neighbors.ne = checkedIfBorder.top || checkedIfBorder.right ? null : {x: this.x, y: this.y - 1};
        neighbors.sw = checkedIfBorder.bottom || checkedIfBorder.left ? null : {x: this.x - 1, y: this.y};
        neighbors.se = checkedIfBorder.bottom || checkedIfBorder.right ? null : {x: this.x, y: this.y};
        return neighbors;
      },

      checkIfBorder : function (width, height) {
        var borders = {};
        borders.top = this.y === 0 ? true : false;
        borders.bottom = this.y === height ? true : false;
        borders.left = this.x === 0 ? true : false;
        borders.right = this.x === width ? true : false;
        return borders;
      },

      getNeighborVertices : function (width, height) {
          var neighbors = {};
          var checkedIfBorder = this.checkIfBorder(width, height);

          neighbors.n = checkedIfBorder.top ? null : {x: this.x, y: this.y - 1};
          neighbors.s = checkedIfBorder.bottom ? null : {x: this.x, y: this.y + 1};
          neighbors.e = checkedIfBorder.right ? null : {x: this.x + 1, y: this.y};
          neighbors.w = checkedIfBorder.left ? null : {x: this.x - 1, y: this.y};
          return neighbors;
        }
    };

    verticesIndices = [20, 24, 28, 36, 44, 52, 56, 60];
    bigVerticesIndices = [44, 48, 52, 84, 92, 124, 128, 132];
    bigVerticesIndices = bigVerticesIndices.concat([176, 180, 184, 188, 216, 228, 256, 268, 296, 300, 304, 308]);
  });

  beforeEach(function () {
    var blackPixels = [20, 21, 22, 24, 25, 26, 36, 37, 38, 40, 41, 42];
    sqrImgData.height = 4;
    sqrImgData.width = 4;
    //4 elements for each pixel for r, g, b, a values
    sqrImgData.data = new Uint8ClampedArray(sqrImgData.height * sqrImgData.width * 4);
    for (var j = 0; j < sqrImgData.data.length; j++) {
      if (verticesIndices.indexOf(j) > -1) {
        var coords = indexToCoords(j, sqrImgData.width, 4);
        vertices[j/4] = new Vertex({x: coords.x, y: coords.y});
      }
      if (blackPixels.indexOf(j) > -1) {
        sqrImgData.data[j] = 0;
      } else {
        sqrImgData.data[j] = 255;
      }
    }

    var twoBlackPixels = [44, 45, 46, 48, 49, 50, 84, 85, 86, 88, 89, 90, 176, 177, 178, 180, 181, 182, 184, 185, 186, 216, 217, 218, 220, 221, 222, 224, 225, 226, 256, 257, 258, 260, 261, 262, 264, 265, 266];
    twoSqrImgData.height = 10;
    twoSqrImgData.width = 10;
    //4 elements for each pixel for r, g, b, a values
    twoSqrImgData.data = new Uint8ClampedArray(twoSqrImgData.height * twoSqrImgData.width * 4);
    for (var k = 0; k < twoSqrImgData.data.length; k++) {
      if (bigVerticesIndices.indexOf(k) > -1) {
        var twoSqrCoords = indexToCoords(k, twoSqrImgData.width, 4);
        bigVertices[k/4] = new Vertex({x: twoSqrCoords.x, y: twoSqrCoords.y});
      }
      if (twoBlackPixels.indexOf(k) > -1) {
        twoSqrImgData.data[k] = 0;
      } else {
        twoSqrImgData.data[k] = 255;
      }
    }
  });

  it('should be initialized given array of vertices and image data', function () {
    assert.doesNotThrow(function () {
      objTests.pathFinder = new PathFinder(vertices, sqrImgData);
    });
    assert.equal(objTests.pathFinder instanceof PathFinder, true);
  });

  it('should throw an error if initialized without array of vertices and image data', function () {
    assert.throws(function() {
      objTests.pathFinder = new PathFinder();
    }, /No vertices and image data given!/);
  });

  it('should be able to follow a set of vertices given a grid index and turn correctly', function () {
    objTests.pathFinder = new PathFinder(vertices, sqrImgData);
    var vertexObj = objTests.pathFinder.allVertices[5],
        nextVertex = objTests.pathFinder.followVertex(vertexObj);

    assert.equal(nextVertex.x, 1);
    assert.equal(nextVertex.y, 2);
  });

  it('should have a function to return the number of vertices it currently has', function () {
    objTests.pathFinder = new PathFinder(vertices, sqrImgData);
    var current = objTests.pathFinder.countVertices();

    assert.equal(8, current);
  });

  it('should be able to add a vertex to a path then delete it in its stored vertices array', function () {
    objTests.pathFinder = new PathFinder(vertices, sqrImgData);
    var vertexIndex = 5,
        current = objTests.pathFinder.countVertices();
    objTests.pathFinder.addToPath(vertexIndex);

    assert.equal(objTests.pathFinder.getCurrentPath().vertices.length, 1);
    assert.equal(objTests.pathFinder.allVertices[vertexIndex], undefined);
  });

  it('should be able to find and return a single path from a 4x4 sample', function () {
    objTests.pathFinder = new PathFinder(vertices, sqrImgData);
    objTests.pathFinder.findAllPaths();
    var allPaths = objTests.pathFinder.getAllPaths();

    assert.equal(allPaths.length, 1);
    assert.equal(allPaths[0].vertices.length, 8);
    for (var i = 0, currV; i < allPaths[0].vertices.length; i++) {
      currV = allPaths[0].vertices[i];
      assert.equal(currV instanceof Vertex, true);
    }
  });

  it('should be able to return both paths from a 10x10 sample', function () {
    objTests.pathFinder = new PathFinder(bigVertices, twoSqrImgData);
    objTests.pathFinder.findAllPaths();
    var allPaths = objTests.pathFinder.getAllPaths();

    assert.equal(allPaths.length, 2);
    assert.equal(allPaths[0].vertices.length, 8);
    assert.equal(allPaths[1].vertices.length, 12);
    for (var i = 0, currV; i < allPaths[0].vertices.length; i++) {
      currV = allPaths[0].vertices[i];
      assert.equal(currV instanceof Vertex, true);
    }
  });
});


describe('Path', function() {
  setup(function () {
    var blackPixels = [20, 21, 22, 24, 25, 26, 36, 37, 38, 40, 41, 42];
    sqrImgData.height = 4;
    sqrImgData.width = 4;
    //4 elements for each pixel for r, g, b, a values
    sqrImgData.data = new Uint8ClampedArray(sqrImgData.height * sqrImgData.width * 4);
    for (var j = 0; j < sqrImgData.data.length; j++) {
      if (verticesIndices.indexOf(j) > -1) {
        coords = indexToCoords(j, sqrImgData.width, 4);
        vertices[j/4] = new Vertex({x: coords.x, y: coords.y});
      }
      if (blackPixels.indexOf(j) > -1) {
        sqrImgData.data[j] = 0;
      } else {
        sqrImgData.data[j] = 255;
      }
    }
  });

  beforeEach(function () {
    verticesIndices = [20, 24, 28, 36, 44, 52, 56, 60];
    var width = 4,
        coords;
    for (var i = 0; i < verticesIndices.length; i++) {
      coords = indexToCoords(verticesIndices[i], width, 4);
      vertices[verticesIndices[i]/4] = new Vertex({x: coords.x, y: coords.y});
    }

    objTests.path = new Path(sqrImgData);
  });

  it('should be instantiable', function () {
    assert.equal(objTests.path instanceof Path, true);
  });

  it('should have an addVertex method which adds to its vertices array when given a vertex object, otherwise throw an error', function () {
    var vertexToAdd = new Vertex({x: 1, y: 1});
    objTests.path.addVertex(vertexToAdd);

    assert.equal(objTests.path.vertices.length, 1);
    assert.throws(function () {
      objTests.path.addVertex();
    }, /No vertex to add to path!/);
  });

  it('should have a function to check whether or not it contains a vertex with given an index or coord', function () {
    var falseCoord = {x: 0, y: 7},
        falseIndex = 17,
        trueCoord = {x: 1, y: 1},
        trueIndex = 5;
    for (var i in vertices) {
      if (vertices.hasOwnProperty(i) && typeof vertices[i] !== 'undefined') {
        objTests.path.addVertex(vertices[i]);
      }
    }

    assert.equal(objTests.path.contains(trueCoord), true);
    assert.equal(objTests.path.contains(trueIndex), true);
    assert.equal(objTests.path.contains(falseCoord), false);
    assert.equal(objTests.path.contains(falseIndex), false);
  });

  it('should have a property to tell whether it is circular', function () {
    var pathCircular = new Path(sqrImgData),
        pathNoncircular = new Path(sqrImgData);
    for (var i in vertices) {
      if (vertices.hasOwnProperty(i) && typeof vertices[i] !== 'undefined') {
        if (pathNoncircular.vertices.length < 4) {
          pathNoncircular.addVertex(vertices[i]);
        }
        pathCircular.addVertex(vertices[i]);
      }
    }
    pathCircular.addVertex(vertices[5]);

    assert.equal(pathCircular.isCircular, true);
    assert.equal(pathNoncircular.isCircular, false);
  });

  it('should return false when trying to addVertex and it is already circular or it already contains that vertex, otherwise add it and return true', function () {
    var pathCircular = new Path(sqrImgData),
        pathNoncircular = new Path(sqrImgData),
        vertexToAdd = new Vertex({x: 1, y: 0}),
        vertexAlreadyAdded = new Vertex({x: 1, y: 1});
    for (var i in vertices) {
      if (vertices.hasOwnProperty(i) && typeof vertices[i] !== 'undefined') {
        if (pathNoncircular.vertices.length < 4) {
          pathNoncircular.addVertex(vertices[i]);
        }
        pathCircular.addVertex(vertices[i]);
      }
    }
    pathCircular.addVertex(vertices[5]);

    assert.equal(pathCircular.addVertex(vertexToAdd), false);
    assert.equal(pathNoncircular.addVertex(vertexToAdd), true);
    assert.equal(pathNoncircular.addVertex(vertexAlreadyAdded), false);
  });

  it('should have a function to return a vertex given its index or coords', function () {
    for (var i in vertices) {
      if (vertices.hasOwnProperty(i) && typeof vertices[i] !== 'undefined') {
        objTests.path.addVertex(vertices[i]);
      }
    }

    var vertex1 = objTests.path.find(5),
        vertex2 = objTests.path.find({x: 1, y: 1});

    assert.equal(vertex1.x, vertex2.x);
    assert.equal(vertex1.y, vertex2.y);
    assert.equal(coordsToIndex(vertex1, 4, 1), coordsToIndex(vertex2, 4, 1));
  });
});
