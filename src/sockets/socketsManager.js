import io from 'socket.io-client'
import Zone from '../lib/zone'

export default function(app){
  let socket = io('http://localhost:3000');

  socket.on('connect', () => {
    //
  });


  /**
   * initial map/world load
   */
  socket.on('world-init', (data)=> {

    /**
     * create a local world instance
     * using the data we recieved from the server
     */
    app.world = new Zone(data.width, data.height);
    app.world.locations = data.locations;
    app.init();
    socket.emit('world-loaded');
  });


  /**
   * do a full zone update by updating each cell
   * with any changed data
   */
  socket.on('world-update', (data)=> {
    processWorldDataAsync(app, data.locations);
  });
}


/**
 * process world updates asynchronously
 * @param {ZoneInstance} data
 * @param {number} startCol
 * @param {number} startRow
 * @returns {null}
 */
function processWorldDataAsync(app, data, startCol = 0, startRow = 0){
  const maxBlockTime = 15;
  const starttime = Date.now();


  let col = startCol;
  let row = startRow;

  /**
   * start iterating through rows of map data
   */
  for(; col < data.length; col++){

    /**
     * make sure we havnt been processing too long.
     */
    if(Date.now() - starttime >= maxBlockTime){
      /**
       * if we have been, reschedule the rest of the work.
       */
      return setTimeout(()=>{
        app.processWorldDataAsync(app, data, col, row);
      }, 0);
    }

    /**
     * process a row
     */
    for (; row < data[0].length; row++){
      app.world.locations[row*app.world.width+col] = Object.assign(app.world.locations[row*app.world.width+col], data[row*app.world.width+col]);
    }

  }
}
