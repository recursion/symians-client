/**
 * The container that draws the view of the world.
 *
 * @exports WorldView
 * @extends Container
 */
import {Container} from 'pixi.js';
import RendererStore from '../renderer/RendererStore'
import {Rect} from 'symian-lib'
import Camera from '../camera/camera'
import Tile from './tile'

/**
 * World Viewer
 */
export default class WorldView extends Container {

 /**
  * creates a pixi container for displaying the world
  * @param {number} width
  * @param {number} height
  */
  constructor(world, inputController) {
    super();

    this.inputController = inputController;
    this.world = world;

    /* setup the camera */
    const [worldSize, screenSizeInTiles] = Camera.getBounds(world, RendererStore);
    this.camera = Camera.create(worldSize, screenSizeInTiles);

    /* setup the renderer */
    RendererStore.set('camera', this.camera);
    RendererStore.addChangeListener(this.resizeHandler.bind(this));
    RendererStore.addAnimateListener(this.draw.bind(this));
  }

  /**
   * resize the camera on resize events
   */
  resizeHandler(){
    const [worldSize, screenSizeInTiles] = Camera.getBounds(this.world, RendererStore);
    this.camera = Camera.create(worldSize, screenSizeInTiles);
    RendererStore.set('camera', this.camera);
  }

  /**
   * iterates through the portion of the world
   * that is viewable by the camera
   * and draws it
   */
  draw(){

    // clear all children from the last frame
    this.removeChildren();

    // iterate through the map locations currently visible to the camera
    let viewableWorld = new Rect(0, 0, this.camera.width, this.camera.height);
    viewableWorld.forEach((col, row)=>{
      // attempt to get the location
      // from the iterations current row and col
      let loc = this.world.getLocation( this.camera.x + col, this.camera.y + row );

      if(loc){

        // if the sprite doesnt exist
        if (!loc.sprite){
          // create it
          loc.sprite = new Tile(loc.type, col, row, RendererStore.get('tilesize'), this.inputController);
        }

        // set the tile sprites coordinates
        // and its width/height
        loc.sprite.set(col, row);

        // add the tiles sprite to our view container
        this.addChild(loc.sprite);
      }
    });
  }
}

