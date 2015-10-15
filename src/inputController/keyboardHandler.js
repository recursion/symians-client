/**
 * registers callbacks for keyCodes
 * and invokes those callbacks when the keyCode is active
 * allows for multiple keypresses to happen simultaneously
 */
export default class KeyboardHandler {
  constructor(){

    // track the state of keypresses
    this.keyState = {};

    // dictionary of callbacks
    // key = keyCode
    // callback = function to invoke when pressed
    this.eventCallbacks = {};
    attachListeners(this.keyState, window);
  }

  /**
   * add a keyboard event listener callback
   */
  addListener(event, action){
    this.eventCallbacks[event] = action;
  }

  /**
   * remove a keyboard event listener callback
   */
  removeListener(event){
    this.eventCallbacks[event] = null;
    delete this.eventCallbacks[event];
  }

  /**
   * invokes defined callbacks for any keys pressed
   * should be called from the gameloop
   */
  processKeys(){

    // iterate through keys in keyState
    for (let key in this.keyState){

      if (this.keyState.hasOwnProperty(key)){

        // if the key is pressed
        if (this.keyState[key]){

          // look up the callback for this keycode
          const cb = this.eventCallbacks[key];

          // if one exists
          if (cb) {

            // call it
            cb();

          }
        }
      }
    }
  }
}

/**
 * attach keyboard event listeners to a dom element
 * @param {Map} dictionary - the object tracking keypresses
 * @param {Element} el - the DOM element to add the listener to
 */
function attachListeners(dictionary, el){
  // track the state of keypresses
  el.addEventListener('keydown', (e)=>{
    dictionary[e.keyCode] = true;
  });

  el.addEventListener('keyup', (e)=>{
    dictionary[e.keyCode] = false;
  });
}


