import PIXI from 'pixi.js';
import RendererStore from './RendererStore';

/**
 * GL Renderer with hooks into a Store
 *
 * Manages main animation loop
 *
 * @exports Renderer
 * @extends WebGLRenderer
 */
export default class Renderer extends PIXI.WebGLRenderer {

  constructor(tilesize, scaleModifier = 2) {

    super();

    addEventListener('resize', this.resizeHandler.bind(this));

    this.scaleModifier = scaleModifier;
    this.resolution = window.devicePixelRatio;
    RendererStore.set('resolution', this.resolution);
    RendererStore.set('tilesize', tilesize);

    this.setStore();

    this.resizeHandler();
  }

  /**
   * sets the container to render
   */
  set target(t){
    this._target = t;
  }

  /**
   * returns the container to render
   */
  get target(){
    return this._target;
  }

  /**
   * Set the stores width and height on resize
   */
  setStore() {
    RendererStore.set('width', this.getWindowSize()[0]);
    RendererStore.set('height', this.getWindowSize()[1]);
  }

  /**
   * Sets's store and emits Change
   * @return {null}
   */
  resizeHandler() {
    let [width, height] = this.getWindowSize();
    // control the scale of the tiles by changing this
    // default is width and height
    this.resize(width / this.scaleModifier, height / this.scaleModifier);
    this.setStore();
    RendererStore.emitChange();
  }

  /**
   * Get the current window size
   * @return {null}
   */
  getWindowSize() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    return [width, height];
  }

  /**
   * Start the animation loop
   * @return {null}
   */
  start() {
    this.active = true;
    window.requestAnimationFrame(this.animate.bind(this));
  }

  /**
   * Stop the animation loop
   * @return {null}
   */
  stop() {
    this.active = false;
  }

  /**
   * Main animation loop, updates animation store
   * @return {null}
   */
  animate() {
    this.render(this.target);

    if(this.active) {
      window.requestAnimationFrame(this.animate.bind(this));
      RendererStore.emitAnimate();
    }
  }
}
