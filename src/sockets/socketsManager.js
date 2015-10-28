import io from 'socket.io-client'
import {Zone} from 'symians-lib'

export default function(app){
  let socket = io('http://localhost:3000');

  socket.on('connect', () => {
    //console.log('Connected');
  });

  socket.on('update', (obj)=>{
    const updates = JSON.parse(obj);
    processUpdates(app, updates);
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
function processUpdates(app, events){

  const startTime = Date.now();

  if (app.zone){
    events.forEach((event, idx)=>{
      switch(event.type){
        case 'create':
          app.createNew(event.object);
          break;
        case 'change':
          if(Date.now() - startTime < 15){
            let x = app.zone.objects[event.object.id];
            if(x){
              x.size = event.object.size;
              x.age = event.object.age;
            }
          } else {
            return setTimeout(()=>{
              processUpdates(app, events.slice(idx));
            }, 1);
          }
          break;
        default:
          break;
      }
    });
  } else {
    // not initialized yet
    // try again later
    setTimeout(()=>{
      processUpdates(app, events);
    }, 10);
  }
}
