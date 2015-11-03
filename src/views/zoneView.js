/**
 * The container that draws the view of the zone.
 *
 * @exports ZoneView
 * @extends Container
 */
//import {Sprite, Container} from 'pixi.js';
import {Container} from 'pixi.js';
import RendererStore from '../renderer/RendererStore'
import {Rect} from 'symians-lib'
import Camera from '../camera/camera'
//import Tile from './tile'
//import SymSprite from './symSprite'

const TIMEMODIFIER = 1000;

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

    this.lastDraw = Date.now();

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
    if(this.camera.moved || Date.now() - this.lastDraw > 250){
      // clear all children from the last frame
      this.removeChildren();

      // iterate through the map locations currently visible to the camera
      let viewableZone = new Rect(0, 0, this.camera.width, this.camera.height);
      viewableZone.forEach((col, row)=>{
        // attempt to get the location
        // from the iterations current row and col
        let loc = this.zone.getLocation( this.camera.x + col, this.camera.y + row );

        if(loc){

          // set the tile sprites coordinates
          // and its width/height
          loc.set(col, row);

          // add the tiles sprite to our view container
          this.addChild(loc);

          // check for other objects at this location
          if (loc.contents.length){
            const obj = loc.contents[0];

            obj.draw(col, row, TIMEMODIFIER);
            this.addChild(obj);
          }
        }
      });
      this.camera.moved = false;
      this.lastDraw = Date.now();
    }

    /*
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
    */
  }
}

