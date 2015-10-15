import {Rect} from '../lib'
/**
 *  Camera is used to control the viewable portion of the world
 *  It is a simply a 'moveable' rectangle that contains another
 *  rectangle (bounds). The camera's x, y coords can be changed
 *  using the camera's directional movement methods. So long as
 *  the movements keep the cameras rectangle contained
 *  within the bounds rectangle, the cameras view will change.
 */
export default class Camera extends Rect{

/**
 *  Create a new camera.
 *@param {Number} x - upper left x coordinate.
 *@param {Number} y - upper left y coordinate.
 *@param {Number} width - rectangle width.
 *@param {Number} height - rectangle height.
 *@param {Rect} bounds - a rectangle that defines the cameras bounds.
 */
  constructor(
      x = 0,
      y = 0,
      width = 0,
      height = 0,
      bounds = new Rect(0, 0, 0, 0)
  ){
    super(x, y, width, height);
    this.bounds = bounds;
  }

  /**
   * decrements the cameras x coordinate
   *@returns {boolean} - true for success, false for failure
   */
  left(){
    if (this.x > this.bounds.x){
      this.x -= 1;
      return true;
    } else {
      return false;
    }
  }

  /**
   * increments the cameras x coordinate
   *@returns {boolean} - true for success, false for failure
   */
  right(){
    //if (this.x + this.width < this.map.width){
    if (this.x + this.width < this.bounds.width){
      this.x += 1;
      return true;
    } else {
      return false;
    }
  }

  /**
   * decrements the cameras y coordinate
   *@returns {boolean} - true for success, false for failure
   */
  up(){
    if (this.y > this.bounds.y){
      this.y -= 1;
      return true;
    } else {
      return false;
    }
  }

  /**
   * increments the cameras y coordinate
   *@returns {boolean} - true for success, false for failure
   */
  down(){
    //if (this.y + this.height < this.map.height){
    if (this.y + this.height < this.bounds.height){
      this.y += 1;
      return true;
    } else {
      return false;
    }
  }

  /**
   * create and return a camera
   * with its bounds set using the world and renderer sizes
   * @param {
   *    @param: {number} width - the worlds width,
   *    @param: {number} height - the worlds height
   * } worldSize - an object describing the worlds size
   *
   * @param {
   *    @param {number} width - screen width in tiles
   *    @param {number} height - screen height in tiles
   * } screenSizeInTiles - size of the screen in game tiles
   * @returns {Camera} A camera configured to this world and renderer size.
   */
  static create(worldSize, screenSizeInTiles){

    const worldWidth = worldSize.width;
    const worldHeight = worldSize.height;

    const cameraWidth = screenSizeInTiles.width;
    const cameraHeight = screenSizeInTiles.height;

    const cameraBounds = new Rect(0, 0, worldWidth, worldHeight);
    return new Camera(0, 0, cameraWidth, cameraHeight, cameraBounds);

  }

  /**
   * finds appropriate bounds for the camera
   * takes a worldStore and a rendererStore
   * and returns a tuple with thier sizes as properties of an object;
   * @param {WorldObject} world - the world data
   * @param {RendererStore} rendererStore - you guessed it..
   * @returns {
   *    @param {number} width,
   *    @param {number} height
   *  }
   */
  static getBounds(world, RendererStore){

    const worldSize = {};
    const screenSizeInTiles = {};

    worldSize.width = world.width;
    worldSize.height = world.height;

    screenSizeInTiles.width = RendererStore.widthInTiles;
    screenSizeInTiles.height = RendererStore.heightInTiles;

    return [worldSize, screenSizeInTiles];

  }
}
