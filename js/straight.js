;(function (exports) {
  var _;
  if (exports._ === undefined && typeof require !== "undefined") {
    _ = require('../js/helpers').Helpers;
  } else {
    _ = exports._;
  }

  var NORTH = 'NORTH',
      SOUTH = 'SOUTH',
      WEST = 'WEST',
      EAST = 'EAST';

  function StraightLine() {}

  /*
   Input: a set of coordinates
   Output: (Boolean) whether or not
   set of coordinates is straight
   */
  StraightLine.isStraight = function(pathVertices) {
    if (StraightLine.containsAllDirections(pathVertices)) return false;
    var startV = pathVertices[0],
        endV = pathVertices[pathVertices.length - 1],
        currentV;

    for (var i = 1; i < pathVertices.length - 1; i++) {
      currentV = pathVertices[i];
      if (distancePointToLine(startV, endV, currentV) > 1) return false;
    }


    function distancePointToLine(startPoint, endPoint, point) {
      var intercept = getIntercept(startPoint, endPoint, point);
      var distancePtToIntercept = getDistanceFromPoints(point, intercept);
      return distancePtToIntercept;
    }

    function getSlope(startPoint, endPoint) {
      return (endPoint.y - startPoint.y)/(endPoint.x - startPoint.x);
    }

    function getBWithTwoPoints(startPoint, endPoint) {
      return endPoint.y - (getSlope(startPoint, endPoint) * endPoint.x);
    }

    function getBWithOnePointAndSlope(point, slope) {
      return point.y - (slope * point.x);
    }

    function getIntercept(startPoint, endPoint, point) {
      var inverseSlope = -(1/getSlope(startPoint, endPoint)).toFixed(3);
      var b2 = getBWithOnePointAndSlope(point, inverseSlope);
      var b1 = getBWithTwoPoints(startPoint, endPoint);
      var interceptX = ((getBWithTwoPoints(startPoint, endPoint) - b2)/(inverseSlope - getSlope(startPoint, endPoint))).toFixed(3);
      var interceptY = ((inverseSlope * interceptX) + b2).toFixed(3);

      return {
        x: interceptX,
        y: interceptY
      };
    }

    function getDistanceFromPoints(start, end) {
      var xDistance = end.x - start.x,
          yDistance = end.y - start.y;
      return Math.sqrt((xDistance * xDistance) + (yDistance * yDistance)).toFixed(3);
    }

    return true;
  };

  StraightLine.containsAllDirections = function(pathVertices) {
    var direction, prevCoord = {}, currentCoord = {}, directions = {};

    for (var i = 1; i < pathVertices.length; i++) {
      prevCoord = pathVertices[i - 1];
      currentCoord = pathVertices[i];
      direction = StraightLine.getDirection(prevCoord, currentCoord);
      directions[direction] = true;
    }

    return countElements(directions) === 4? true : false;
  };

  StraightLine.getDirection = function(coordFrom, coordTo) {
    var distance = {};
    distance.x = coordTo.x - coordFrom.x;
    distance.y = coordTo.y - coordFrom.y;
    if (distance.y === -1) {
      return NORTH;
    } else if (distance.x === 1) {
      return EAST;
    } else if (distance.y === 1) {
      return SOUTH;
    } else if (distance.x === -1) {
      return WEST;
    }
    return false;
  };

  exports.StraightLine = StraightLine;

}(this));
