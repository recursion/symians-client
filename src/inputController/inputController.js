import Selection from './selection.js'
import KeyboardHandler from './keyboardHandler.js'
import RendererStore from '../renderer/RendererStore'

/**
 * Input handling / management
 * has a module for managing mouse selections
 * and another for keyboard event handling
 */
export default class InputController {
  constructor(world){
    this.selection = new Selection(world, RendererStore);
    this.keyboardHandler = new KeyboardHandler();
    RendererStore.addAnimateListener(this.process.bind(this));
  }
  /**
   * For anything that tick by tick processing
   * Should be called from the main application loop
   */
  process(){
    this.keyboardHandler.processKeys();
  }
}
