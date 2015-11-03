import RendererStore from '../renderer/RendererStore'
import Location from './location'
import Grass from './grass'
import Tree from './tree'
import Squirrel from './squirrel'

/**
 * create a new object in game
 * @param {GObj} obj - the object to create
 */
export function create(obj, zone, ioController){
  const loc = zone.getLocation(obj.x, obj.y);
  if(loc){
    if(!zone.objects[obj.id]){
      const newO = buildDisplayObjectByType(obj, ioController);
      if (newO){
        loc.contents.push(newO);
        zone.objects[obj.id] = newO;
      }
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
      const newO = buildDisplayObjectByType(obj, ioController);
      if (newO){
        loc.contents[idx] = newO;
        zone.objects[o.id] = newO;
      }
    });
  });
  return zone;
}

/**
 * takes an object and attempts to build a display object from it
 * @param {Object} obj - A game object
 * @param {InputController} inputController - an instance of an input controller
 * @returns {Sprite}
 */
function buildDisplayObjectByType(obj, inputController){

  if (!obj) { return null; }

  if (typeof obj.type !== 'string'){
    throw new Error('Incorrect type for object type. Should be string but was: ', obj.type);
  }

  switch(obj.type.toLowerCase()){
    case 'grass':
      return Object.assign(new Grass(obj.x, obj.y, obj.size, inputController), obj);
      break;

    case 'tree':
      return Object.assign(new Tree(obj.x, obj.y, obj.size, inputController), obj);
      break;

    case 'squirrel':
      return Object.assign(new Squirrel(obj.x, obj.y, obj.size, inputController), obj);
      break;

    default:
      throw new Error('Unknown Type given for object: ', obj);
      break;
  }

}
