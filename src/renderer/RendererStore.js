import EventEmitter from 'events';
import { RESIZE, ANIMATE } from '../constants/AppConstants';

/**
 * Render Store
 * Keeps render variables
 *
 * @data
 * 	width : window width
 * 	height : window height
 * 	resolution : display density
 */
class RendererStore extends EventEmitter {

  constructor(...args) {
    super(...args);

    this.renderer = null ;
    this.data = {
      widthInTiles: 0,
      heightInTiles: 0,
      tilesize: 0,
      resolution: 1
    };
  }

  /**
   * calculates the number of tiles that
   * can fit horizontally on the current renderer
   */
  get widthInTiles(){
    return Math.floor(this.renderer.width / this.data.tilesize);
  }

  /**
   * calculates the number of tiles that
   * can fit vertically on current renderer
   */
  get heightInTiles(){
    return Math.floor(this.renderer.height / this.data.tilesize);
  }

  /**
   * takes a set of screen coordinates and translates them into a map location
   * @param {number} col - a map col (aka x coord)
   * @param {number} row - a map row (aka y coord)
   * @returns {number, number}  - translated coordinates
   */
  translateCoords(col, row, modify=true){
    const modifiedCol = Math.round(col / this.get('tilesize'));
    const modifiedRow = Math.round(row / this.get('tilesize'));
    if (modify){
      col = modifiedCol;
      row = modifiedRow;
    }
    const x =  (col % this.widthInTiles) + this.data.camera.x;
    const y =  (row % this.heightInTiles) + this.data.camera.y;
    return [x, y];
  }

  /**
   * returns the data for a given key
   */
  get(key) {
    return this.data[key];
  }

  /**
   * sets the data for a given key
   */
  set(key, value) {
    return this.data[key] = value;
  }

  /**
   * emits an animate to registered listeners
   */
  emitAnimate() {
    this.emit(ANIMATE, this.data);
  }

  /**
   * registers a listener for the animate event
   */
  addAnimateListener(callback) {
    this.on(ANIMATE, callback, this.data);
  }

  /**
   * emits an update to registered listeners
   */
  emitChange() {
    this.emit(RESIZE, this.data);
  }

  /**
   * registers a listener for the update event
   */
  addChangeListener(callback) {
    this.on(RESIZE, callback, this.data);
  }
}

export default new RendererStore();
