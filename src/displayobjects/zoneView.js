/**
 * The container that draws the view of the zone.
 *
 * @exports ZoneView
 * @extends Container
 */
import {Container} from 'pixi.js';
import RendererStore from '../renderer/RendererStore'
import {Rect} from 'symians-lib'
import Camera from '../camera/camera'
import Tile from './tile'
import SymSprite from './symSprite'

/*
 * Zone Viewer
 */
export default class ZoneView extends Container {

 /**
  * creates a pixi container for displaying the zone
  * @param {number} width
  * @param {number} height
  */
  constructor(zone, inputController) {
    super();

    this.inputController = inputController;
    this.zone = zone;

    /* setup the camera */
    const [zoneSize, screenSizeInTiles] = Camera.getBounds(zone, RendererStore);
    this.camera = Camera.create(zoneSize, screenSizeInTiles);

    /* setup the renderer */
    RendererStore.set('camera', this.camera);
    RendererStore.addChangeListener(this.resizeHandler.bind(this));
    RendererStore.addAnimateListener(this.draw.bind(this));
  }

  /**
   * resize the camera on resize events
   */
  resizeHandler(){
    const [zoneSize, screenSizeInTiles] = Camera.getBounds(this.zone, RendererStore);
    this.camera = Camera.create(zoneSize, screenSizeInTiles);
    RendererStore.set('camera', this.camera);
  }

  /**
   * iterates through the portion of the zone
   * that is viewable by the camera
   * and draws it
   */
  draw(){

    // clear all children from the last frame
    this.removeChildren();

    // iterate through the map locations currently visible to the camera
    let viewableZone = new Rect(0, 0, this.camera.width, this.camera.height);
    viewableZone.forEach((col, row)=>{
      // attempt to get the location
      // from the iterations current row and col
      let loc = this.zone.getLocation( this.camera.x + col, this.camera.y + row );

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
    this.zone.mobs.forEach((mob)=>{
      // if the mob is in the bounds of the camera
      const TILESIZE = RendererStore.get('tilesize');

      // if the mobs screen position is in bounds
      // add it to the view

      if (this.camera.inBounds(mob)){
        // create a sprite for this object if it doesnt have on
        if (!mob.sprite){
          mob.sprite = new SymSprite('mob', mob.x, mob.y, TILESIZE, this.inputController);
        }
        //const modX = mob.x % this.zone.width
        //const modY = mob.y % this.zone.height;
        //mob.sprite.set(mob.x - this.camera.x, mob.y - this.camera.y );
        mob.sprite.set(mob.x - this.camera.x, mob.x - this.camera.y);
        // draw it
        this.addChild(mob.sprite);
      }

    });
  }
}

