var assert = require('assert'),
    sinon = require('sinon'),
    _ = require('../js/helpers').Helpers,
    Vertex = require('../js/vertex').Vertex,
    PathFinder = require('../js/path').PathFinder,
    Path = require('../js/path').Path;

var objTests = {
      pathFinder: null,
      path: null
    },
    smallVertices = [],
    bigVertices = [],
    verticesIndices,
    bigVerticesIndices,
    blankImgData = {},
    sqrImgData = {},
    twoSqrImgData = {};


describe('Path Finder', function() {
  setup(function () {
    verticesIndices = [20, 24, 28, 36, 44, 52, 56, 60];
    bigVerticesIndices = [44, 48, 52, 84, 92, 124, 128, 132];
    bigVerticesIndices = bigVerticesIndices.concat([176, 180, 184, 188, 216, 228, 256, 268, 296, 300, 304, 308]);
  });

  beforeEach(function () {
    var smallBlackPixels = [20, 21, 22, 24, 25, 26, 36, 37, 38, 40, 41, 42];
    sqrImgData.height = 4;
    sqrImgData.width = 4;
    //4 elements for each pixel for r, g, b, a values
    sqrImgData.data = new Uint8ClampedArray(sqrImgData.height * sqrImgData.width * 4);
    buildStubs(sqrImgData, smallBlackPixels, verticesIndices, smallVertices);

    var twoBlackPixels = [44, 45, 46, 48, 49, 50, 84, 85, 86, 88, 89, 90, 176, 177, 178, 180, 181, 182, 184, 185, 186,
                          216, 217, 218, 220, 221, 222, 224, 225, 226, 256, 257, 258, 260, 261, 262, 264, 265, 266];
    twoSqrImgData.height = 10;
    twoSqrImgData.width = 10;
    //4 elements for each pixel for r, g, b, a values
    twoSqrImgData.data = new Uint8ClampedArray(twoSqrImgData.height * twoSqrImgData.width * 4);
    buildStubs(twoSqrImgData, twoBlackPixels, bigVerticesIndices, bigVertices);

    // this changes the objects passed to it
    function buildStubs(imgData, blackPixels, verticesIndices, vertices) {
      for (var j = 0; j < imgData.data.length; j++) {
        if (verticesIndices.indexOf(j) > -1) {
          var coords = _.indexToCoords(j, imgData.width, 4),
              neighborPixelCoords = sinon.stub(),
              neighborVertexCoords = sinon.stub();
          vertices[j/4] = new Vertex(coords.x, coords.y);
          //for simplification but sacrificing coverage,
          //we do not have edges in the image border yet
          neighborPixelCoords.returns({
              nw: { x: coords.x - 1, y: coords.y - 1 },
              ne: { x: coords.x, y: coords.y - 1 },
              sw: { x: coords.x - 1, y: coords.y },
              se: { x: coords.x, y: coords.y }
          });
          neighborVertexCoords.returns({
            n: { x: coords.x, y: coords.y - 1 },
            s: { x: coords.x, y: coords.y + 1 },
            e: { x: coords.x + 1, y: coords.y },
            w: { x: coords.x - 1, y: coords.y }
          });
          vertices[j/4].neighborPixelCoords = neighborPixelCoords;
          vertices[j/4].neighborVertexCoords = neighborVertexCoords;
        }
        if (blackPixels.indexOf(j) > -1) {
          imgData.data[j] = 0;
        } else {
          imgData.data[j] = 255;
        }
      }
    }
  });

  it('should be initialized given array of vertices and image data', function () {
    assert.doesNotThrow(function () {
      objTests.pathFinder = new PathFinder(smallVertices, sqrImgData);
    });
    assert.equal(objTests.pathFinder instanceof PathFinder, true);
  });

  it('should throw an error if initialized without array of vertices and image data', function () {
    assert.throws(function() {
      objTests.pathFinder = new PathFinder();
    }, /No vertices and image data given!/);
  });

  it('should have a function to return the number of vertices it currently has', function () {
    objTests.pathFinder = new PathFinder(smallVertices, sqrImgData);
    var current = objTests.pathFinder.countVertices();

    assert.equal(8, current);
  });

  it('should be able to add a vertex to a path then delete it in its stored vertices array', function () {
    objTests.pathFinder = new PathFinder(smallVertices, sqrImgData);
    var vertexIndex = 5,
        current = objTests.pathFinder.countVertices();
    objTests.pathFinder.addToPath(vertexIndex);

    assert.equal(objTests.pathFinder.getCurrentPath().vertices.length, 1);
    assert.equal(objTests.pathFinder.allVertices[vertexIndex], undefined);
  });

  it('should be able to find and return a single path from a 4x4 sample', function () {
    objTests.pathFinder = new PathFinder(smallVertices, sqrImgData, Vertex);
    objTests.pathFinder.findAllPaths();
    var allPaths = objTests.pathFinder.allPaths;

    assert.equal(allPaths.length, 1);
    assert.equal(allPaths[0].vertices.length, 8);
    for (var i = 0, currV; i < allPaths[0].vertices.length; i++) {
      currV = allPaths[0].vertices[i];
      assert.equal(currV instanceof Vertex, true);
    }
  });

  it('should be able to return both paths from a 10x10 sample', function () {
    objTests.pathFinder = new PathFinder(bigVertices, twoSqrImgData, Vertex);
    objTests.pathFinder.findAllPaths();
    var allPaths = objTests.pathFinder.allPaths;

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
    var smallBlackPixels = [20, 21, 22, 24, 25, 26, 36, 37, 38, 40, 41, 42];
    sqrImgData.height = 4;
    sqrImgData.width = 4;
    //4 elements for each pixel for r, g, b, a values
    sqrImgData.data = new Uint8ClampedArray(sqrImgData.height * sqrImgData.width * 4);
    for (var j = 0; j < sqrImgData.data.length; j++) {
      if (verticesIndices.indexOf(j) > -1) {
        coords = _.indexToCoords(j, sqrImgData.width, 4);
        smallVertices[j/4] = new Vertex(coords.x, coords.y);
      }
      if (smallBlackPixels.indexOf(j) > -1) {
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
      coords = _.indexToCoords(verticesIndices[i], width, 4);
      smallVertices[verticesIndices[i]/4] = new Vertex(coords.x, coords.y);
    }

    objTests.path = new Path(sqrImgData);
  });

  it('should be instantiable', function () {
    assert.equal(objTests.path instanceof Path, true);
  });

  it('should have an addVertex method which adds to its vertices array when given a vertex object', function () {
    var vertexToAdd = new Vertex(1, 1);
    objTests.path.addVertex(vertexToAdd);

    assert.equal(objTests.path.vertices.length, 1);
  });

  it('should have a function to check whether or not it contains a vertex with given an index or coord', function () {
    var falseCoord = {x: 0, y: 7},
        falseIndex = 17,
        trueCoord = {x: 1, y: 1},
        trueIndex = 5;
    for (var i in smallVertices) {
      if (typeof smallVertices[i] !== 'undefined') {
        objTests.path.addVertex(smallVertices[i]);
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
    for (var i in smallVertices) {
      if (typeof smallVertices[i] !== 'undefined') {
        if (pathNoncircular.vertices.length < 4) {
          pathNoncircular.addVertex(smallVertices[i]);
        }
        pathCircular.addVertex(smallVertices[i]);
      }
    }
    pathCircular.addVertex(smallVertices[5]);

    assert.equal(pathCircular.isCircular, true);
    assert.equal(pathNoncircular.isCircular, false);
  });

  it('should return false when trying to addVertex and it is already circular or it already contains that vertex, otherwise add it and return true', function () {
    var pathCircular = new Path(sqrImgData),
        pathNoncircular = new Path(sqrImgData),
        vertexToAdd = new Vertex(1, 0),
        vertexAlreadyAdded = new Vertex(1, 1);
    for (var i in smallVertices) {
      if (typeof smallVertices[i] !== 'undefined') {
        if (pathNoncircular.vertices.length < 4) {
          pathNoncircular.addVertex(smallVertices[i]);
        }
        pathCircular.addVertex(smallVertices[i]);
      }
    }
    pathCircular.addVertex(smallVertices[5]);

    assert.equal(pathCircular.addVertex(vertexToAdd), false);
    assert.equal(pathNoncircular.addVertex(vertexToAdd), true);
    assert.equal(pathNoncircular.addVertex(vertexAlreadyAdded), false);
  });

  it('should have a function to return a vertex given its index or coords', function () {
    for (var i in smallVertices) {
      if (typeof smallVertices[i] !== 'undefined') {
        objTests.path.addVertex(smallVertices[i]);
      }
    }

    var vertex1 = objTests.path.find(5),
        vertex2 = objTests.path.find({x: 1, y: 1});

    assert.equal(vertex1.x, vertex2.x);
    assert.equal(vertex1.y, vertex2.y);
    assert.equal(_.coordsToIndex(vertex1, 4, 1), _.coordsToIndex(vertex2, 4, 1));
  });
});
