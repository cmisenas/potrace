;(function(exports) {

  /*
   * Pixel
   * To go a certain direction, check the following pixels
   * N
   * BLACK
   * NW 
   * WHITE
   * NE 
   * E
   * BLACK
   * NE 
   * WHITE
   * SE
   * S
   * BLACK
   * SE
   * WHITE
   * SW
   * W
   * BLACK
   * SW
   * WHITE
   * NW
   */
  
  //this object is responsible for getting all paths given all the vertices in gathered in the image
  function PathFinder(vertices) {
    this.allPaths = [];
  }

  PathFinder.prototype.getAllPaths = function() {
    return this.allPaths;
  }

  //this object is responsible for forming an individual path and is instantiated by PathFinder object
  function Path(vertices){
    this.allVertices = vertices.slice(0);
    this.pathVertices = [];
  }

  Path.prototype.addVertex = function(vObj) {
    this.pathVertices.push(vObj);
  }

  //this is the main function that will determine how the path will follow the vertex
  Path.prototype.followVertex = function(vObj) { 
  }

}(this));
