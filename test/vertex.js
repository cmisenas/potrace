var assert = require('assert'),
    VertexFinder = require('../js/vertex').VertexFinder,
    Vertex = require('../js/vertex').Vertex;

var objTests = {
      vertexFinder: null,
      vertex: null
    },
    blankImgData = {},
    sqrImgData = {},
    cornerSqrImgData = {};

describe('Vertex Finder', function () {
  setup(function () {
    blankImgData.height = 3;
    blankImgData.width = 3;
    //4 elements for each pixel for r, g, b, a values
    blankImgData.data = new Uint8ClampedArray(blankImgData.height * blankImgData.width * 4);
    for (var i = 0; i < blankImgData.data.length; i++) {
      blankImgData.data[i] = 255;
    }

    sqrImgData.height = 4;
    sqrImgData.width = 4;
    //4 elements for each pixel for r, g, b, a values
    sqrImgData.data = new Uint8ClampedArray(sqrImgData.height * sqrImgData.width * 4);
    for (var j = 0; j < sqrImgData.data.length; j++) {
      sqrImgData.data[j] = 255;
    }
    //Make one pixel black so there will be an existing 'edge'
    sqrImgData.data[20] = 0;
    sqrImgData.data[21] = 0;
    sqrImgData.data[22] = 0;

    cornerSqrImgData.height = 4;
    cornerSqrImgData.width = 4;
    var blackPixels = [0, 1, 2, 4, 5, 6, 16, 17, 18, 20, 21, 22];

    //4 elements for each pixel for r, g, b, a values
    cornerSqrImgData.data = new Uint8ClampedArray(cornerSqrImgData.height * cornerSqrImgData.width * 4);
    for (var j = 0; j < cornerSqrImgData.data.length; j++) {
      if (blackPixels.indexOf(j) > -1) {
        cornerSqrImgData.data[j] = 0;
      } else {
        cornerSqrImgData.data[j] = 255;
      }
    }
    //Make one pixel black so there will be an existing 'edge'
  });

  beforeEach(function () {
    delete objTests.vertexFinder;
  });

  it('should be initialized given image data', function () {
    objTests.vertexFinder = new VertexFinder(blankImgData);

    assert.equal(objTests.vertexFinder instanceof VertexFinder, true);
  });

  it('should throw an error if initialized without image data', function () {
    assert.throws(function () {
      objTests.vertexFinder = new VertexFinder();
    }, /No image data passed!/);
  });

  it('should add a vertex with its index as x + width * y to its internal array of all vertices', function () {
    objTests.vertexFinder = new VertexFinder(blankImgData);

    assert.equal(objTests.vertexFinder.addVertex({x: 1, y: 1}), true);
    assert.equal(objTests.vertexFinder.allVertices[4].x, 1);
    assert.equal(objTests.vertexFinder.allVertices[4].y, 1);
    assert.equal(objTests.vertexFinder.vLength, 1);
  });

  it('should be able to find all vertices that are edges', function () {
    objTests.vertexFinder = new VertexFinder(sqrImgData);
    objTests.vertexFinder.findAllVertices();

    assert.equal(objTests.vertexFinder.vLength, 4);
  });

  it('should be able to find all edge vertices even those that touch the boundaries of the image', function () {
    objTests.vertexFinder = new VertexFinder(cornerSqrImgData);
    objTests.vertexFinder.findAllVertices();

    assert.equal(objTests.vertexFinder.vLength, 8);
  });

  it('should return groups of vertex', function () {
    objTests.vertexFinder = new VertexFinder(blankImgData);
    objTests.vertexFinder.addVertex({x: 0, y: 0});
    objTests.vertexFinder.addVertex({x: 1, y: 0});
    objTests.vertexFinder.addVertex({x: 1, y: 1});

    assert.equal(objTests.vertexFinder.vLength, 3);
    assert.equal(objTests.vertexFinder.allVertices.join(''), '[object Object][object Object][object Object]');
  });

});

describe('Vertex', function () {
  setup(function () {
    blankImgData.height = 3;
    blankImgData.width = 3;
    //4 elements for each pixel for r, g, b, a values
    blankImgData.data = new Uint8ClampedArray(blankImgData.height * blankImgData.width * 4);
    for (var i = 0; i < blankImgData.data.length; i++) {
      blankImgData.data[i] = 255;
    }

    sqrImgData.height = 4;
    sqrImgData.width = 4;
    //4 elements for each pixel for r, g, b, a values
    sqrImgData.data = new Uint8ClampedArray(sqrImgData.height * sqrImgData.width * 4);
    for (var j = 0; j < sqrImgData.data.length; j++) {
      sqrImgData.data[j] = 255;
    }
    //Make one pixel black so there will be an existing 'edge'
    sqrImgData.data[20] = 0;
    sqrImgData.data[21] = 0;
    sqrImgData.data[22] = 0;
  });

  beforeEach(function () {
    delete objTests.vertex;
  });

  it('should be able to initialize with x and y passed', function () {
    objTests.vertex = new Vertex(1, 1);
    assert.equal(objTests.vertex instanceof Vertex, true);
  });

  it('should throw error when initialized without x and y passed', function () {
    assert.throws(function () {
      objTests.vertex = new Vertex();
    }, /No x and y passed!/);
  });

  it('should be able to get its neighboring pixels correctly', function () {
    objTests.vertex = new Vertex(1, 1);
    var neighbors = objTests.vertex.neighborPixelCoords(3, 3);

    assert.equal(neighbors.nw.x, 0);
    assert.equal(neighbors.nw.y, 0);
    assert.equal(neighbors.ne.x, 1);
    assert.equal(neighbors.ne.y, 0);
    assert.equal(neighbors.sw.x, 0);
    assert.equal(neighbors.sw.y, 1);
    assert.equal(neighbors.se.x, 1);
    assert.equal(neighbors.se.y, 1);
  });

  it('should be able to get its neighboring vertices correctly', function () {
    objTests.vertex = new Vertex(1, 1);
    var neighbors = objTests.vertex.neighborVertexCoords(3, 3);

    assert.equal(neighbors.n.x, 1);
    assert.equal(neighbors.n.y, 0);
    assert.equal(neighbors.s.x, 1);
    assert.equal(neighbors.s.y, 2);
    assert.equal(neighbors.e.x, 2);
    assert.equal(neighbors.e.y, 1);
    assert.equal(neighbors.w.x, 0);
    assert.equal(neighbors.w.y, 1);
  });

  it('should handle getting neighbor pixels of vertices that are boundaries of the image', function () {
    var vertex1 = new Vertex(0, 0),
        vertex2 = new Vertex(0, 1),
        neighbors1 = vertex1.neighborPixelCoords(3, 3),
        neighbors2 = vertex2.neighborPixelCoords(3, 3);

    assert.equal(neighbors1.nw, 255);
    assert.equal(neighbors1.ne, 255);
    assert.equal(neighbors1.sw, 255);
    assert.equal(neighbors1.se.x, 0);
    assert.equal(neighbors1.se.y, 0);

    assert.equal(neighbors2.nw, 255);
    assert.equal(neighbors2.sw, 255);
    assert.equal(neighbors2.ne.x, 0);
    assert.equal(neighbors2.ne.y, 0);
    assert.equal(neighbors2.se.x, 0);
    assert.equal(neighbors2.se.y, 1);
  });

  it('should handle getting neighbor vertices of vertices that are boundaries of the image', function () {
    var vertex1 = new Vertex(0, 0);
    var vertex2 = new Vertex(0, 1);
    var neighbors1 = vertex1.neighborVertexCoords(3, 3);
    var neighbors2 = vertex2.neighborVertexCoords(3, 3);

    assert.equal(neighbors1.n, null);
    assert.equal(neighbors1.e.x, 1);
    assert.equal(neighbors1.e.y, 0);
    assert.equal(neighbors1.s.x, 0);
    assert.equal(neighbors1.s.y, 1);

    assert.equal(neighbors2.w, null);
    assert.equal(neighbors2.n.x, 0);
    assert.equal(neighbors2.n.y, 0);
    assert.equal(neighbors2.s.x, 0);
    assert.equal(neighbors2.s.y, 2);
    assert.equal(neighbors2.e.x, 1);
    assert.equal(neighbors2.e.y, 1);
  });

  it('should be able to determine if vertex is an edge', function () {
    var vertex1 = new Vertex(1, 1),
        vertex2 = new Vertex(2, 2),
        vertex3 = new Vertex(3, 2),
        vertex4 = new Vertex(3, 3);

    assert.equal(vertex1.checkIfEdge(sqrImgData), true);
    assert.equal(vertex2.checkIfEdge(sqrImgData), true);
    assert.equal(vertex3.checkIfEdge(sqrImgData), false);
    assert.equal(vertex4.checkIfEdge(sqrImgData), false);
  });

});
