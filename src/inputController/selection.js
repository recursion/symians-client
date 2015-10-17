import {Rect, Point} from 'symians-lib'

/**
 * handles in-world selections
 */
export default class Selection {

  /**
   * @param {WorldStore} worldStore - a worldstore object
   * @param {RendererStore} rendererStore - a rendererStore object
   */
  constructor(worldStore, rendererStore) {

    this._worldStore = worldStore;
    this._rendererStore = rendererStore;

    this._selected = [];
    this._startPoint = new Point(0, 0);
    this._endPoint = new Point(0, 0);
    this.mode = 0;
    this.active = false;

  }

  /**
   * selects the location at x, y
   * (adds it to the selected array and tints it)
   * @param {number} x - the x coordinate
   * @param {number} y - the y coordinate
   */
  select(x, y){
    const loc = this._worldStore.getLocation(x, y);
    this._selected.push(loc);

    loc.sprite.tint = 0xcccccc;
  }

  /**
   * start tracking a new selection
   * @param {number} x - the x coordinate to start selecting from
   * @param {number} y - the y coordinate to start selecting from.
   */
  start(x, y){
    this.active = true;
    this._startPoint = new Point(x, y);
    this._endPoint = new Point(x+1, y+1);
    this.update();
  }

  /**
   * add a new location to the selection
   * @param {number} x - the x coordinate to start selecting from
   * @param {number} y - the y coordinate to start selecting from.
   */
  add(x, y){
    if (this.active){
      this._endPoint = new Point(x+1, y+1);
      this.update();
    }
  }

  /**
   * stops adding to a selection at the x and y coordinate
   * @param {number} x - the x coordinate to start selecting from
   * @param {number} y - the y coordinate to start selecting from.
   */
  stop(x, y){
    this._endPoint = new Point(x+1, y+1);
    this.active = false;
    this.update();
  }

  /**
   * changes all previously selected tiles
   * back to no tint and then replaces the
   * objects selected array with a new blank one.
   */
  clear(){
    this.removeTint();
    this.empty();
  }

  /**
   * removes the tint from currently selected tiles
   */
  removeTint(){
    this._selected.forEach((tile)=> {
      tile.sprite.tint = (0xffffff);
    });
  }

  /**
   * emptys the selected collection
   */
  empty(){
    this._selected = [];
  }

  calculateSelection(){
    // calculate starting point
    let startX = Math.min(this._startPoint.x, this._endPoint.x);
    let startY = Math.min(this._startPoint.y, this._endPoint.y);

    // calculate end point
    let endX = Math.max(this._startPoint.x, this._endPoint.x);
    let endY = Math.max(this._startPoint.y, this._endPoint.y);

    // create a new rectangle
    return new Rect(startX, startY, endX, endY);
  }

  /**
   * updates rendering data of the current selection
   */
  update(){

    // clear the previous selection
    this.clear();

    /**
     * iterate through our selected tiles
     * starting with the coordinate closest to 0
     * and 'select' each tile
     */
    this.calculateSelection().forEach((col, row) => {
      const [x, y] = this._rendererStore.translateCoords(col, row);
      this.select(x, y);
    });
  }

}
