var assert = require('assert'),
    VertexFinder = require('../js/vertex').VertexFinder;
Vertex = require('../js/vertex').Vertex;

var objTests = {
      vertexFinder: null,
      vertex: null
    },
    blankImgData = {},
    sqrImgData = {};

/*
 * Vertex Finder is responsible for gathering all vertices
 * It is given an image data and iterates through each of that
 * It does not mind which vertices are connected or not
 */

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
  });

  beforeEach(function () {
    delete objTests.vertexFinder;
  });

  it('should be initialized given image data', function () {
    objTests.vertexFinder = new VertexFinder(blankImgData);

    assert.equal(objTests.vertexFinder instanceof VertexFinder, true);
  });

  it('should throw an error if initialized without image data', function () {
    assert.throws(function() {
      objTests.vertexFinder = new VertexFinder();
    }, /No image data passed!/);
  });

  it('should add a vertex to its internal array of all vertices', function () {
    objTests.vertexFinder = new VertexFinder(blankImgData);

    assert.equal(objTests.vertexFinder.addVertex({x: 1, y: 1}), true);
    assert.equal(objTests.vertexFinder.getAllVertices().length, 1);
  });
  
  it('should be able to find all vertices that are edges', function () {
    objTests.vertexFinder = new VertexFinder(sqrImgData);
    objTests.vertexFinder.findAllVertices();
    var allVertices = objTests.vertexFinder.getAllVertices();

    assert.equal(allVertices.length, 4);
  });

  it('should return groups of vertex', function () {
    objTests.vertexFinder = new VertexFinder(blankImgData);
    objTests.vertexFinder.addVertex({x: 0, y: 0});
    objTests.vertexFinder.addVertex({x: 1, y: 0});
    objTests.vertexFinder.addVertex({x: 1, y: 1});

    assert.equal(objTests.vertexFinder.getAllVertices().length, 3);
    assert.equal(objTests.vertexFinder.getAllVertices().join(''), '[object Object][object Object][object Object]');
  });

});

/*
 * Vertex is just an object created to
 * check if a given coordinate of a vertex is in fact an edge
 * and to handle vertices that are on the boundaries of an image
 * it also has a method to get its 4 neighboring pixels
 * and its 4 neighboring vertex
 */

describe('Vertex', function() {
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

  it('should be able to initialize with x and y passed', function() {
    objTests.vertex = new Vertex(1, 1);
    assert.equal(objTests.vertex instanceof Vertex, true);
  });

  it('should throw error when initialized without x and y passed', function() {
    assert.throws(function() {
      objTests.vertex = new Vertex();
    }, /No x and y passed!/);
  });

  it('should be able to get its neighboring pixels correctly', function() {
    objTests.vertex = new Vertex(1, 1);
    var neighbors = objTests.vertex.getNeighbors(3, 3);

    assert.equal(neighbors.nw.x, 0);
    assert.equal(neighbors.nw.y, 0);
    assert.equal(neighbors.ne.x, 1);
    assert.equal(neighbors.ne.y, 0);
    assert.equal(neighbors.sw.x, 0);
    assert.equal(neighbors.sw.y, 1);
    assert.equal(neighbors.se.x, 1);
    assert.equal(neighbors.se.y, 1);
  });

  it('should handle vertices that are boundaries of the image', function() {
    var vertex1 = new Vertex(0, 0);
    var vertex2 = new Vertex(0, 1);
    var neighbors1 = vertex1.getNeighbors(3, 3);
    var neighbors2 = vertex2.getNeighbors(3, 3);

    assert.equal(neighbors1.nw, null);
    assert.equal(neighbors1.ne, null);
    assert.equal(neighbors1.sw, null);
    assert.equal(neighbors1.se.x, 0);
    assert.equal(neighbors1.se.y, 0);

    assert.equal(neighbors2.nw, null);
    assert.equal(neighbors2.sw, null);
    assert.equal(neighbors2.ne.x, 0);
    assert.equal(neighbors2.ne.y, 0);
    assert.equal(neighbors2.se.x, 0);
    assert.equal(neighbors2.se.y, 1);
  });

  it('should be able to determine if vertex is an edge', function() {
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
