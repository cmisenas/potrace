;(function(exports) {
  var SVG_ELEMENT_ID = 'main';

  //this object is responsible for getting all paths given all the vertices in gathered in the image
  function SVGBuilder(path) {
    this.path = path;
    if (SVGBuilder.pathCount === undefined) { SVGBuilder.pathCount = 0; }
    this.pathId = SVGBuilder.pathCount;
    SVGBuilder.pathCount++;
  }

  SVGBuilder.prototype.initDOM = function () {
    if ($('svg').length > 0) { return true; }
    // add an svg element if page still does not have one
    return !!$('body').append($('<svg id="' + SVG_ELEMENT_ID +'" xmlns="http://www.w3.org/2000/svg"/>'));
  };

  SVGBuilder.prototype.getD = function () {
    var d = 'M ' + this.path.vertices[0].x + ' ' + this.path.vertices[0].y;
    for (var i = 1; i < this.path.vertices.length; i++) {
      d += ' L ' + this.path.vertices[i].x + ' ' + this.path.vertices[i].y;
    }
    d += ' L ' + this.path.vertices[0].x + ' ' + this.path.vertices[0].y;
    return d;
  };

  SVGBuilder.prototype.buildSVGElement = function () {
    var d = this.getD();

    this.SVGElement = document.createElementNS('http://www.w3.org/2000/svg','path');
    this.SVGElement.setAttribute('id', 'path-' + this.pathId);
    this.SVGElement.setAttribute('stroke', 'black');
    this.SVGElement.setAttribute('stroke-width', '1');
    this.SVGElement.setAttribute('fill', 'none');
    this.SVGElement.setAttribute('d', d);
  };

  SVGBuilder.prototype.renderSVGElement = function () {
    if (!this.initDOM()) { throw new Error('Something went wrong with initializing SVG element!'); }
    this.buildSVGElement();
    return !!$('#' + SVG_ELEMENT_ID).append(this.SVGElement);
  };

  SVGBuilder.prototype.setDimensions = function (width, height) {
    $('svg').attr({ width: width, height: height });
  };

  exports.SVGBuilder = SVGBuilder;

}(this));
