import io from 'socket.io-client'
import {Zone} from 'symians-lib'

export default function(app){
  let socket = io('http://localhost:3000');

  socket.on('connect', () => {
    //console.log('Connected');
  });


  /**
   * object grow event
   */
  socket.on('grow', (obj)=>{

    const objects = JSON.parse(obj);

    // find the object in the client zone storage

    // make sure the app is initialized
    if (app.zone){
      objects.forEach((obj)=>{
        let x = app.zone.objects[obj.id];
        if(x){
          x.size = obj.size;
        }
      });
    }


  });


  /**
   * initial map/world load
   */
  socket.on('zone-init', (data)=> {

    /**
     * create a local world instance
     * using the data we recieved from the server
     */
    const zone = new Zone(data.width, data.height);
    zone.locations = data.locations;

    socket.emit('zone-loaded');
    app.init(zone);
  });

  // receive the zone created message
  // and the zone object
  socket.on('zoneCreated', (data)=>{
    /**
     * create sprites from our zone object
     */

    const zone = inflateZone(data);
    socket.emit('zone-loaded');
    app.init(zone);
  });

  socket.on('create', (data)=> {
    // add this object to a list of renderables
    //app.zone.mobs.push(JSON.parse(data));
  });

  /**
   * a game object has updated
   */
  socket.on('update', (data)=> {
    // update an objects local data
    //data = JSON.parse(data);

    /*
    // TODO: turn mobs into a set so we get constant time access
    app.zone.mobs.forEach((mob, idx)=>{
      if (mob.key === data.key){
        app.zone.mobs[idx] = Object.assign({}, mob, data);
      }
    });
    */

    //processZoneDataAsync(app, data.locations);
  });

  /* a game object was created */
  socket.on('create', (data)=> {
    //processZoneDataAsync(app, data.locations);
  });

}

function inflateZone(data){
  let zObject = JSON.parse(data);
  const zone = new Zone(zObject.width, zObject.height);
  zone.locations = zObject.locations;
  return zone;
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
     * process and update a row
     * existing properties are overwritten with new ones.
     * local models tend to have some properties that will not
     * exist on the data packet.
     */
    for (; row < data[0].length; row++){
      app.zone.locations[row*app.zone.width+col] = Object.assign(app.zone.locations[row*app.zone.width+col], data[row*app.zone.width+col]);
    }

  }
}
