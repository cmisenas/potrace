var assert = require('assert'),
    SVGBuilder = require('../js/svg_builder').SVGBuilder;

var linePath,
    polygonPath,
    lineSVGBuilder,
    polygonSVGBuilder;

describe('SVG Builder', function() {
  setup(function () {
    linePath = { vertices: [
      {x: 10, y: 10},
      {x: 20, y: 20},
    ]};
    polygonPath = { vertices: [
      {x: 60, y: 0},
      {x: 120, y: 0},
      {x: 180, y: 60},
      {x: 180, y: 120},
      {x: 120, y: 180},
      {x: 60, y: 180},
      {x: 0, y: 120},
      {x: 0, y: 60},
    ]};
    lineSVGBuilder = new SVGBuilder(linePath);
    polygonSVGBuilder = new SVGBuilder(polygonPath);
  });

  it('calculates coordinate string of a straight line given only two vertices', function () {
    assert.equal(lineSVGBuilder.getD(), 'M 10 10 L 20 20 L 10 10');
  });

  it('calculates coordinate string of a polygon given a circular path of vertices', function () {
    assert.equal(polygonSVGBuilder.getD(), 'M 60 0 L 120 0 L 180 60 L 180 120 L 120 180 L 60 180 L 0 120 L 0 60 L 60 0');
  });

/**
 *  TODO: We need a stubbing library for calling the document object to write these tests.
 *
 *   it('returns svg element of a straight line given only two vertices', function () {
 *     assert.equal(lineSVGBuilder.buildSVGElement(), '');
 *   });
 *
 *   it('returns svg element of a polygon given a circular path of vertices', function () {
 *     assert.equal(polygonSVGBuilder.buildSVGElement(), '');
 *   });
 *
 */

});

