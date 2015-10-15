import Zone from './zone'

let zone;
describe('Zone', ()=> {
  before(()=>{
    zone = new Zone();
  });
  it('defaults to a width and height of 0', ()=> {
    expect(zone.width).to.equal(0);
    expect(zone.height).to.equal(0);
  });
  it('has a width property', ()=> {
    expect(zone).to.have.property('width');
  });
  it('has a height property', ()=> {
    expect(zone).to.have.property('height');
  });
  it('has a map property', ()=> {
    expect(zone).to.have.property('map');
  });
  describe('#getLocation', ()=> {
    it('returns null when given invalid coordinates', ()=> {
      let z = new Zone(10, 10);
      let l = z.getLocation(11, 1);
      expect(l).to.be.null;
    });
    it('returns a map location when given valid inputs', ()=> {
      let z = new Zone(10, 10);
      let l = z.getLocation(1, 1);
      expect(l).to.equal(z.map[1][1]);
    });
  });
  describe('::createMap', ()=> {
    it('returns an empty array when given no arguments', ()=> {
      expect(Array.isArray(Zone.createMap())).to.equal(true);
    });
    it('returns a (height-length)array of (width-length)arrays.', ()=> {
      let z = Zone.createMap(32, 32);
      expect(z.length).to.equal(32);
      expect(z[0].length).to.equal(32);
    });
  });
});
