import {Rect} from 'symians-lib'
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
      bounds = new Rect(0, 0, 0, 0),
      moverate=60
  ){
    super(x, y, width, height);
    this.lastXMove = 0;
    this.lastYMove = 0;
    this.moved = true;
    this.bounds = bounds;
    this.moverate = moverate;
  }

  /**
   * determines if a given point is within its bounds
   * @param {Point} point - an object with x, y coords
   * @returns {Boolean} - true if in bounds, otherwise false
   */
  inBounds(point){
    if (point.x >= this.x && point.x < this.x + this.width){
      if (point.y >= this.y && point.y < this.y + this.height){
        return true;
      }
    }
    return false;
  }
  /**
   * decrements the cameras x coordinate
   *@returns {boolean} - true for success, false for failure
   */
  left(){
    if(this.lastXMove === 0 || Date.now() - this.lastXMove > this.moverate){
      if (this.x > this.bounds.x){
        this.x -= 1;
        this.lastXMove = Date.now();
        this.moved = true;
        return true;
      } else {
        return false;
      }
    } else {
      this.moved = false;
      return false;
    }
  }

  /**
   * increments the cameras x coordinate
   *@returns {boolean} - true for success, false for failure
   */
  right(){
    //if (this.x + this.width < this.map.width){
    if(this.lastXMove === 0 || Date.now() - this.lastXMove > this.moverate){
      if (this.x + this.width < this.bounds.width){
        this.x += 1;
        this.lastXMove = Date.now();
        this.moved = true;
        return true;
      } else {
        return false;
      }
    } else {
      this.moved = false;
      return false;
    }
  }

  /**
   * decrements the cameras y coordinate
   *@returns {boolean} - true for success, false for failure
   */
  up(){
    if(this.lastYMove === 0 || Date.now() - this.lastYMove > this.moverate){
      if (this.y > this.bounds.y){
        this.y -= 1;
        this.lastYMove = Date.now();
        this.moved = true;
        return true;
      } else {
        return false;
      }
    } else {
      this.moved = false;
      return false;
    }
  }


  /**
   * increments the cameras y coordinate
   *@returns {boolean} - true for success, false for failure
   */
  down(){
    //if (this.y + this.height < this.map.height){
    if(this.lastYMove === 0 || Date.now() - this.lastYMove > this.moverate){
      if (this.y + this.height < this.bounds.height){
        this.y += 1;
        this.lastYMove = Date.now();
        this.moved = true;
        return true;
      } else {
        return false;
      }
    } else {
      this.moved = false;
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
