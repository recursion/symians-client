/**
 * Grass man! Grass!
 *
 * @exports Grass
 * @extends Sprite
 */

import {Sprite} from 'pixi.js';
import RendererStore from '../renderer/RendererStore'

/**
  Creates a grass object
 **/
export default class Grass extends Sprite {

  /*
   */
  constructor(x = 0, y = 0, size = 15, inputController) {
    super();

    this.inputController = inputController;

    this.tilesize = RendererStore.get('tilesize');
    this.size = size;
    this.texture = RendererStore.get('terrainTextures')['sprite669'];
    this.set(x, y);

    this.interactive = true;

    /* mouse event handlers */
    this.on('mouseover', this.onMouseOver.bind(this));
    this.on('mousedown', this.onMouseDown.bind(this));
    this.on('mouseup', this.onMouseUp.bind(this));

  }

  /**
   * sets x, y coords and
   * sets width and height based on global tilesize setting
   * @param {number} x - the x coordinate to set
   * @param {number} y - the y coordinate to set
   */
  set(x, y){
    this.x = x * this.tilesize;
    this.y = y * this.tilesize;
    this.width = this.size;
    this.height = this.size;
  }

  /**
   * if we are already selecting stuff,
   * add this new point to the selection
   * and redraw it
   */
  onMouseOver(){
    this.inputController.selection.add(this.x, this.y)
  }

  /**
   * clear any existing selection
   * and start selecting a new selection
   */
  onMouseDown(){
    this.inputController.selection.start(this.x, this.y)
  }

  /**
   * stop selecting
   */
  onMouseUp(){
    this.inputController.selection.stop(this.x, this.y)
  }
}

