var assert = require('assert'),
    sinon = require('sinon'),
    _ = require('../js/helpers').Helpers,
    VertexNS = require('../js/vertex'),
    Vertex = VertexNS.Vertex,
    VertexFinder = VertexNS.VertexFinder,
    PathNS = require('../js/path'),
    Path = PathNS.Path,
    PathFinder = PathNS.PathFinder;

describe('VertexFinder', function() {
  it('finds all vertices including the ones on the image boundary', function() {
  });

  it('finds all vertices in an image where background is black and foreground is white', function() {
  });
});

describe('PathFinder', function() {
  it('finds all paths from vertices that touch the image boundary', function() {
  });

  it('finds all paths in an image where background is black and foreground is white', function() {
  });

  it('closes all paths', function() {
  });
});

