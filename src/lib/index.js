//import requireDirectory from 'require-directory'
//export default requireDirectory(module, {exclude: /.spec.js$/});
import Rect from './rect'
import Point from './point'
import Zone from './zone'

export default {
  Zone: Zone,
  Rect: Rect,
  Point: Point
};
