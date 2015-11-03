import RendererStore from '../renderer/RendererStore'
import Location from './location'
import SymSprite from './symSprite'

/**
 * create a new object in game
 * @param {GObj} obj - the object to create
 */
export function create(obj, zone){
  const loc = zone.getLocation(obj.x, obj.y);
  if(loc){
    if(!zone.objects[obj.id]){
      const newO = Object.assign(new SymSprite(obj.type.toLowerCase(), obj.x, obj.y, obj.size, this.inputController), obj);
      loc.contents.push(newO);
      zone.objects[obj.id] = newO;
    }
  }
}

/**
 * convert location data and thier contents to sprites
 */
export function convertZoneDataToSprites(zone, ioController){
  let size = RendererStore.get('tilesize');
  zone.objects = {};
  zone.locations.forEach((loc, i)=>{
    const newSprite = Object.assign(new Location(loc.type, loc.x, loc.y, size, ioController), loc);
    zone.locations[i] = newSprite;
    zone.locations[i].contents.forEach((o, idx)=>{
      const newO = Object.assign(new SymSprite(o.type.toLowerCase(), o.x, o.y, o.size, ioController), o);
      loc.contents[idx] = newO;
      zone.objects[o.id] = newO;
    });
  });
  return zone;
}

