import io from 'socket.io-client'
import {Zone} from 'symians-lib'

export default function(app){
  let socket = io('http://localhost:3000');

  socket.on('connect', () => {
    //console.log('Connected');
  });

  socket.on('create', (obj)=>{
    const parsed = JSON.parse(obj);
    app.createNew(parsed);
  });

  /**
   * object grow event
   */
  socket.on('change', (obj)=>{

    const objects = JSON.parse(obj);

    // find the object in the client zone storage

    // make sure the app is initialized

    processObjectUpdates(app, objects);
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

}

function inflateZone(data){
  let zObject = JSON.parse(data);
  const zone = new Zone(zObject.width, zObject.height);
  zone.locations = zObject.locations;
  return zone;
}

/**
 * nonblocking method of iterating through an array of objects
 * @param {App} app - the application instance
 * @param {Array} objects - an array of objects that need updating
 */
function processObjectUpdates(app, objects){

  const startTime = Date.now();

  if (app.zone){
    objects.forEach((obj, idx)=>{

      if(Date.now() - startTime < 15){
        let x = app.zone.objects[obj.id];
        if(x){
          x.size = obj.size;
        }
      } else {
        return setTimeout(()=>{

          processObjectUpdates(app, objects.slice(idx + 1));

        }, 10);
      }
    });
  }

}
