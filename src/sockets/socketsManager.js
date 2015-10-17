import io from 'socket.io-client'
import {Zone} from 'symians-lib'

export default function(app){
  let socket = io('http://localhost:3000');

  socket.on('connect', () => {
    //
    console.log('Connected');
  });


  /**
   * initial map/world load
   */
  socket.on('zone-init', (data)=> {

    /**
     * create a local world instance
     * using the data we recieved from the server
     */
    app.zone = new Zone(data.width, data.height);
    console.log(data);
    app.zone.locations = data.locations;

    app.init();
    socket.emit('world-loaded');
  });


  /**
   * do a full zone update by updating each cell
   * with any changed data
   */
  socket.on('zone-update', (data)=> {
    console.log('wut');
    //processZoneDataAsync(app, data.locations);
  });
}


/**
 * process zone updates asynchronously
 * @param {ZoneInstance} data
 * @param {number} startCol
 * @param {number} startRow
 * @returns {null}
 */
function processZoneDataAsync(app, data, startCol = 0, startRow = 0){
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
        processZoneDataAsync(app, data, col, row);
      }, 0);
    }

    /**
     * process a row
     */
    for (; row < data[0].length; row++){
      app.zone.locations[row*app.zone.width+col] = Object.assign(app.zone.locations[row*app.zone.width+col], data[row*app.zone.width+col]);
    }

  }
}
