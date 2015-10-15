import Selection from './selection'

let testSubject;

// map for mock worldstore
let makeMap = () => {
  let map = [];
  for (let col = 0; col < 100; col++){
    map[col] = [];
    for(let row = 0; row < 100; row++){
      map[col][row] = {
        x: col,
        y: row,
        sprite: {}
      };
    }
  }
  return map;
}

// mock rendPointererStore
const RendererStore = {
  translateCoords(x, y){
    return [x, y];
  }
};

// mock worldstore
let WorldStore = {};

WorldStore.map = makeMap();
WorldStore.getLocation = (x, y) => {
  return WorldStore.map[x][y];
};


describe('selection', ()=> {
  beforeEach(()=> {
    testSubject = new Selection(WorldStore, RendererStore);
    WorldStore.map = makeMap();
  });


  describe('.startPoint', ()=> {

    it('is an object with an x and y property', ()=> {
      expect(testSubject._startPoint).to.have.property('x');
      expect(testSubject._startPoint).to.have.property('y');
    });

    it('x and y default to 0 when there is nothing selected', ()=> {
      expect(testSubject._startPoint).to.have.property('x', 0);
      expect(testSubject._startPoint).to.have.property('y', 0);
    });
  });

  describe('.endPoint', ()=> {

    it('is an object with an x and y property', ()=> {
      expect(testSubject._endPoint).to.have.property('x');
      expect(testSubject._endPoint).to.have.property('y');
    });

    it('x and y default to 0 when there is nothing selected', ()=> {
      expect(testSubject._endPoint).to.have.property('x', 0);
      expect(testSubject._endPoint).to.have.property('y', 0);
    });
  });

  describe('#start', ()=> {
    it('sets the startPoint and endPoint points', ()=> {
      testSubject.start(1, 1);
      expect(testSubject._startPoint).to.have.property('x', 1);
      expect(testSubject._startPoint).to.have.property('y', 1);
      expect(testSubject._endPoint).to.have.property('x', 2);
      expect(testSubject._endPoint).to.have.property('y', 2);
    });

    it('resets startPoint and endPoint to the current location', ()=> {
      expect(testSubject._startPoint).to.have.property('x', 0);
      expect(testSubject._startPoint).to.have.property('y', 0);
      expect(testSubject._endPoint).to.have.property('x', 0);
      expect(testSubject._endPoint).to.have.property('y', 0);

      testSubject.start(1, 1);
      testSubject.add(2, 2);
      testSubject.stop(3, 3);

      testSubject.start(1, 1);

      expect(testSubject._startPoint).to.have.property('x', 1);
      expect(testSubject._startPoint).to.have.property('y', 1);
      expect(testSubject._endPoint).to.have.property('x', 2);
      expect(testSubject._endPoint).to.have.property('y', 2);

      testSubject.start(10, 10);

      expect(testSubject._startPoint).to.have.property('x', 10);
      expect(testSubject._startPoint).to.have.property('y', 10);
      expect(testSubject._endPoint).to.have.property('x', 11);
      expect(testSubject._endPoint).to.have.property('y', 11);
    });
  });

  describe('#add', ()=> {
    it('does nothing when the active property is false', ()=> {
      testSubject.add(1, 1);
      expect(testSubject._endPoint).to.have.property('x', 0);
      expect(testSubject._endPoint).to.have.property('y', 0);
    });

    it('sets the current endPoint when selecting is active', ()=> {
      testSubject.active = true;
      testSubject.add(1, 1);
      expect(testSubject._endPoint).to.have.property('x', 2);
      expect(testSubject._endPoint).to.have.property('y', 2);
    });
  });

  describe('#stop', ()=> {

    it('stops adding to the selection after called', ()=> {
      testSubject.start(1, 1);
      testSubject.add(2, 2);
      testSubject.stop(3, 3);

      testSubject.add(4, 4);
      testSubject.add(5, 5);

      expect(testSubject._endPoint.x).to.equal(4);
      expect(testSubject._endPoint.y).to.equal(4);
    });

  });

  describe('#calculateSelection', ()=> {
    it('returns a Rect object with an x and y property', ()=> {
      expect(testSubject.calculateSelection()).to.have.property('x');
      expect(testSubject.calculateSelection()).to.have.property('y');
      expect(testSubject.calculateSelection()).to.have.property('width');
      expect(testSubject.calculateSelection()).to.have.property('width');
    });
    it('creates the rectangle using the lowest x and y coordinates as the start point', ()=> {
      testSubject.start(1, 1);
      testSubject.stop(5, 5); // adds 1 to each
      expect(testSubject.calculateSelection()).to.have.property('x', 1);
      expect(testSubject.calculateSelection()).to.have.property('y', 1);

      expect(testSubject.calculateSelection()).to.have.property('width', 6);
      expect(testSubject.calculateSelection()).to.have.property('height', 6);

      testSubject.start(10, 10);
      testSubject.stop(5, 5);
      expect(testSubject.calculateSelection()).to.have.property('x', 6);
      expect(testSubject.calculateSelection()).to.have.property('y', 6);

      expect(testSubject.calculateSelection()).to.have.property('width', 10);
      expect(testSubject.calculateSelection()).to.have.property('height', 10);
    });
  });

  describe('#removeTint', ()=> {
    it('sets the tint property on any selected tile sprites to white', ()=>{

      testSubject.start(1, 1);
      testSubject.add(1, 2);
      testSubject.add(1, 3);
      testSubject.stop(1, 4);
      testSubject.update();
      testSubject.removeTint();
      //expect(spy.called).to.equal(true);
      expect(WorldStore.getLocation(1, 1).sprite).to.have.property('tint', 0xffffff);
    });
  });

  describe('#update', ()=> {
    it('clears the previous selection', ()=> {
      let clearSpy = sinon.spy(testSubject, 'clear');
      testSubject.update();
      expect(clearSpy.called).to.equal(true);
    });
    it('adds all current tiles in the selection to the collection', ()=>{
      testSubject.start(1, 1);
      testSubject.stop(2, 2);
      testSubject.update();
      expect(testSubject._selected.length).to.equal(4);
    });
    it('sets the tint property on all selected tiles', ()=>{
      let ogColor = WorldStore.getLocation(1, 1).sprite.tint;
      testSubject.start(1, 1);
      testSubject.stop(2, 2);
      testSubject.update();
      expect(WorldStore.getLocation(1, 1).sprite.tint).to.not.equal(ogColor);
    });
  });

  describe('#select', ()=> {
    it('adds the location at the selected point to the selected collection', ()=> {
      expect(testSubject._selected.length).to.equal(0);
      testSubject.select(1, 1);
      expect(testSubject._selected.length).to.equal(1);
    });
    it('changes the tint property of the sprite on the location object', ()=> {
      expect(WorldStore.getLocation(1, 1).sprite.tint).to.not.exist;
      testSubject.select(1, 1);
      expect(WorldStore.getLocation(1, 1).sprite.tint).to.exist;
    });
  });

  describe('#empty', ()=> {
    it('removes all items from the selected collection', ()=> {
      testSubject._selected.push(1);
      testSubject._selected.push(2);
      testSubject._selected.push(3);
      expect(testSubject._selected.length).to.equal(3);
      testSubject.empty();
      expect(testSubject._selected.length).to.equal(0);
    });
  });

  describe('#clear', ()=> {
    it('it calls empty and remoteTint', ()=> {
      let removeTintSpy = sinon.spy(testSubject, 'removeTint');
      let emptySpy = sinon.spy(testSubject, 'empty');
      testSubject.clear();
      expect(removeTintSpy.called).to.equal(true);
      expect(emptySpy.called).to.equal(true);
    });
  });
});
