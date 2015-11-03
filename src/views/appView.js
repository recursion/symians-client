/**
 * Main App Display Object
 * All other ingame views will exist inside of this one
 * @exports App
 * @extends ScaledContainer
 */
import {Container} from 'pixi.js'

/**
 * Main application view container.
 * All other views are sub-containers of this one.
 */
export default class AppView extends Container {

  /**
   * creates the main application view
   * @param {number} width
   * @param {number} height
   */
  constructor(mainView) {
    super();

    /*
     * instantiate a new world view and add it to the main application view
     */
    this.worldView = mainView;
    this.addChild(this.worldView);
  }
}
