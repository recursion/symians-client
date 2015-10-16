/**
 * A zone is the largest chunk of a world that
 * can be 'subscribed' to at a time. It is very
 * much a level or 'zone' within the world.
 */

/**
 * a zone object - basically a map.
 */
export default class Zone {

  /**
   * creates a Zone instance
   *@param {number} width - the total width of the zone
   *@param {number} height - the total height of the zone
   */
  constructor(width=0, height=0){
    this.width = width;
    this.height = height;
    this.locations = Zone.createMap(width, height);
  }

  /**
   * retrieves a map location
   *@param {number} x - an x coordinate
   *@param {number} y - a y coordinate
   *@returns {Location} - a location item or null
   */
  getLocation(x, y){
    let idx = (y*this.width)+x;
    let loc = this.locations[idx];
    if (loc){
      return this.locations[idx];
    } else {
      return null;
    }
  }

  /**
   * creates an empty multi-dimensional array
   * with width columns and height rows;
   *@param {number} width - the width of the zone
   *@param {number} height - the height of the zone
   *@returns {array} - multidiminsional array representing the zone map
   */
  static createMap(width, height, tilesize = 16){
    const map = [];
    let type;

    for (let col = 0; col < width; col++){

      for (let row = 0; row < height; row++){

        if (col === 0 || col === width - 1 || row === 0 || row === width - 1){
          type = 'water';
        } else if (Math.random() >= 0.95){
          type = 'wall';
        } else {
          type = 'grass';
        }

        let tile = {type: type, x: col, y: row, width: tilesize, height: tilesize, contents: []};

        map[row*width+col] = tile;//tile;

      }
    }
    return map;
  }
}

