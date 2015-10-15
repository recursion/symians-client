import Rect from './rect'

let rect;

describe('Rect', ()=> {
  before(()=>{
    rect = new Rect();
  });
  it('has an x property that defaults to 0', ()=> {
    expect(rect).to.have.property('x', 0);
  });
  it('has a y property that defaults to 0', ()=> {
    expect(rect).to.have.property('y', 0);
  });
  it('has a width property that defaults to 0', ()=> {
    expect(rect).to.have.property('width', 0);
  });
  it('has a height property that defaults to 0', ()=> {
    expect(rect).to.have.property('height', 0);
  });
  describe('#forEach', ()=> {
    it('calls a callback on each point in the rectangle.', ()=> {
      rect = new Rect(0, 0, 10, 10);
      const cb = sinon.spy();
      rect.forEach(cb);
      expect(cb.callCount).to.equal(rect.width*rect.height);
    });
    it('uses its own x and y values as the start of the iteration', ()=> {
      rect = new Rect(5, 5, 10, 10);
      const cb = sinon.spy();
      rect.forEach(cb);
      expect(cb.callCount).to.equal((rect.width - rect.x) * (rect.height - rect.y));
    });
  });
  describe('::fromPoints', ()=> {
    it('returns a rectangle when given two points', ()=> {
      const TS = Rect.fromPoints({x: 1, y: 1}, {x: 2, y: 2});
      expect(TS).to.be.instanceof(Rect);
    });
  });
});

