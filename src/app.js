/**
 * App.js
 *
 * The main entry point, appends PIXI to the DOM
 * and starts a render and animation loop
 *
 */
import './index.html'
import {loaders} from 'pixi.js'
import * as keys from './constants/KeyConstants'
import RendererStore from './renderer/RendererStore'
import Renderer from './renderer/renderer'
import AppView from './views/appView'
import ZoneView from './views/zoneView'
import InputController from './inputController/inputController'
import socketsManager from './sockets/socketsManager'
import * as SpriteFactory from './displayobjects/spriteFactory'

const TILESIZE = 16;

/**
 * The main application object -
 * Gives some needed values to the the stores.
 * Initializes the renderer and loads the assets.
 * Also starts rendering when all assets are loaded.
 */
class App {
  constructor(){

    this.renderer = RendererStore.renderer = new Renderer(TILESIZE);

    // TODO: subscribe to server data instead
    this.zone = null; //new Zone(MAPWIDTH, MAPHEIGHT);

    this.started = false;

    // queue objects not created yet
    this.objectCreationQueue = [];

    /**
     * create an asset loader
     */
    this.loader = new loaders.Loader();

    /**
     * add the renderer view to the dom
     */
    document.body.appendChild(this.renderer.view);


    /* start the loader */
    this.loader.add('terrain', '../assets/spritesheets/roguelike.json');
    this.loader.once('complete', this.onAssetsLoaded.bind(this));
    this.loader.load();

  }

  /**
   * work to do once all assets are loaded
   */
  onAssetsLoaded(){
    // add a reference to our spritesheet textures on to our store
    RendererStore.set('terrainTextures', this.loader.resources.terrain.textures);
    socketsManager(this);
  }

  /**
   * only do this once we have some data from the server
   */
  init(zone){

    if(this.started){
      this.renderer.stop();
      this.started = false;
    }

    this.zone = zone;
    this.inputController = new InputController(this.zone);
    this.zone = SpriteFactory.convertZoneDataToSprites(zone, this.inputController);
    this.initKeyControls();

    /**
     * Initialize the application view
     */
    this.zoneView = new ZoneView(this.zone, this.inputController);

    // add the main view to the renderer
    this.renderer.target = new AppView(this.zoneView);

    // start rendering
    this.renderer.start();
    this.started = true;
  }

  /**
   * determine whether to create a new game object
   * now or add it to a queue and do it later
   * @param {GObj} obj - the object to create
   */
  createNew(obj){
    if (this.started){
      if (this.objectCreationQueue.length){
        this.objectCreationQueue.forEach((obj)=>{
          SpriteFactory.create(obj, zone);
        });
        this.objectCreationQueue = [];
      } else {
        SpriteFactory.create(obj, this.zone);
      }
    } else {
      this.objectCreationQueue.push(obj);
    }
  }

  /*
   * initialize keyboard controls
   * @TODO: change this to use a configuration object
   * instead of the key constants. The configuration object
   * would load its keybindings based on user settings, and
   * the constants would be defaults the config object used.
   */
  initKeyControls(){
    const KH = this.inputController.keyboardHandler;

    /**
     * CAMERA CONTROLS
     */
    KH.addListener(keys.UP, function(){
      RendererStore.get('camera').up();
    });
    KH.addListener(keys.DOWN, function(){
      RendererStore.get('camera').down();
    });
    KH.addListener(keys.LEFT, function(){
      RendererStore.get('camera').left();
    });
    KH.addListener(keys.RIGHT, function(){
      RendererStore.get('camera').right();
    });
  }
}
export default new App();
