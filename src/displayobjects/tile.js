/**
 * A map tile. Generally terrain.
 *
 * @exports Tile
 * @extends Sprite
 */

import {Sprite} from 'pixi.js';
import RendererStore from '../renderer/RendererStore'

/**
 * creates a tile representing a single map location
 **/
export default class Tile extends Sprite {

  /*
   * @TODO this should take a location object
   * and parse that to determine display
   * @param {string} type - the type of terrain for this tile
   * @param {number} width - the width of the tile
   * @param {number} height - the height of the tile
   */
  constructor(type='grass', x = 0, y = 0, tilesize = 16, inputController) {
    super(getTextureByType(type));

    this.inputController = inputController;

    this.tilesize = tilesize;
    //this.texture = this.getTextureByType(type);
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
    this.width = this.tilesize;
    this.height = this.tilesize;
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

/**
 * gets a pixi texture by string type
 * @param {string} type - the image type to use as the texture
 * @returns {PIXI.Texture} - the texture
 */
function getTextureByType(type){
  switch(type){
    case 'grass':
      return RendererStore.get('terrainTextures')['sprite6'];
    case 'dirt':
      return RendererStore.get('terrainTextures')['sprite64'];
    case 'water':
      return RendererStore.get('terrainTextures')['sprite1'];
    default:
      console.error(type);
      throw new Error('Invalid terrain when it should default???');
  }
}
