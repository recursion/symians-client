import {Rect} from 'symian-lib'
import Camera from './camera'

// Mocks
const MockRendererStore = {widthInTiles: 5, heightInTiles: 5};
const MockWorld = {
  width: 0,
  height: 0,
  map: []
};

// tests
let c, camera;
describe('Camera', ()=> {
  beforeEach(()=>{
    let rect = new Rect(0, 0, 100, 100);
    c = new Camera(90, 90, 10, 10, rect);
    camera = new Camera();
  });

  it('extends rect', ()=> {
    expect(camera instanceof Rect).to.equal(true);
  });

  describe('.bounds', ()=> {
    it('is a rect', ()=> {
      expect(camera.bounds).to.be.instanceof(Rect);
    });
  });

  describe('#left', ()=> {
    it('decrements the x coordinate by 1', ()=> {
      let rect = new Rect(0, 0, 100, 100);
      let c = new Camera(90, 90, 10, 10, rect);
      expect(c.x).to.equal(90);
      c.left();
      expect(c.x).to.equal(89);
    });
    it('does not move x below bounds.x', ()=> {
      expect(camera.left()).to.equal(false);
      expect(camera.x).to.equal(0);
      camera.left();
      expect(camera.x).to.equal(0);
    });
  });

  describe('#right', ()=> {
    it('increments the x coordinate by 1', ()=> {
      let rect = new Rect(0, 0, 100, 100);
      let c = new Camera(0, 0, 10, 10, rect);
      expect(c.x).to.equal(0);
      c.right();
      expect(c.x).to.equal(1);
    });
    it('does not move x above bounds.x - width', ()=>{
      expect(c.right()).to.equal(false);
    });
  });

  describe('#up', ()=> {
    it('decrements the y coordinate by 1', ()=> {
      expect(c.y).to.equal(90);
      c.up();
      expect(c.y).to.equal(89);
    });
    it('does not move y below bounds.y', ()=> {
      expect(camera.up()).to.equal(false);
      expect(camera.y).to.equal(0);
    });
  });

  describe('#down', ()=> {
    it('increments the y coordinate by 1', ()=> {
      let rect = new Rect(0, 0, 100, 100);
      let c = new Camera(0, 0, 10, 10, rect);
      expect(c.y).to.equal(0);
      c.down();
      expect(c.y).to.equal(1);
    });
    it('does not move y below bounds.height - height', ()=>{
      expect(c.y).to.equal(90);
      expect(c.down()).to.equal(false);
      expect(c.y).to.equal(90);
    });
  });

  describe('#set', ()=> {
    xit('returns an error on invalid coordinates', ()=> {

    });
    xit('sets the x, y of the camera when given valid, in bounds coordinates', ()=> {

    });
  });

  describe('#center', ()=> {
    xit('', ()=> {

    });
  });

  describe('#follow', ()=> {
    xit('', ()=> {

    });
  });

  describe('::create', ()=> {
    it('throw an error when not given any values', ()=> {
      let err;
      try {
        Camera.create()
      } catch(e){
        err = e;
      }
        expect(err).to.exist;
    });

    it('returns a new camera', ()=> {
      const worldSize = {};
      const screenSizeInTiles = {};

      worldSize.width = 100;
      worldSize.height = 100;

      screenSizeInTiles.width = 30;
      screenSizeInTiles.height = 20;

      let testSubject = Camera.create(worldSize, screenSizeInTiles);
      expect(testSubject).to.be.instanceof(Camera);
    });

    it('sets the cameras width and height equal to the screenSizeInTiles', ()=> {
      const worldSize = {};
      const screenSizeInTiles = {};

      worldSize.width = 100;
      worldSize.height = 100;

      screenSizeInTiles.width = 30;
      screenSizeInTiles.height = 20;

      let testSubject = Camera.create(worldSize, screenSizeInTiles);

      expect(testSubject.width).to.equal(30);
      expect(testSubject.height).to.equal(20);

    });

    it('sets the cameras bounds width and height equal to the worlds width and height', ()=> {
      const worldSize = {};
      const screenSizeInTiles = {};

      worldSize.width = 100;
      worldSize.height = 100;

      screenSizeInTiles.width = 30;
      screenSizeInTiles.height = 20;

      let testSubject = Camera.create(worldSize, screenSizeInTiles);

      expect(testSubject.bounds.width).to.equal(100);
      expect(testSubject.bounds.height).to.equal(100);
    });
  });

  describe('::getBounds', ()=> {

    beforeEach(()=> {
      MockWorld.width = 10;
      MockWorld.height = 10;
    })

    it('returns a tuple of objects', ()=> {
      expect(Camera.getBounds(MockWorld, MockRendererStore)[0]).to.be.an('object');
      expect(Camera.getBounds(MockWorld, MockRendererStore)[1]).to.be.an('object');
    });

    it('returns objects that each have a width and height property', ()=> {
      const testSubject1 = Camera.getBounds(MockWorld, MockRendererStore)[0];
      const testSubject2 = Camera.getBounds(MockWorld, MockRendererStore)[1];

      expect(testSubject1).to.have.property('width');
      expect(testSubject1).to.have.property('height');


      expect(testSubject2).to.have.property('width');
      expect(testSubject2).to.have.property('height');
    });

    it('returns the width and height of each item it was given', ()=> {

      const testSubject1 = Camera.getBounds(MockWorld, MockRendererStore)[0];
      const testSubject2 = Camera.getBounds(MockWorld, MockRendererStore)[1];

      expect(testSubject1).to.have.property('width', 10);
      expect(testSubject1).to.have.property('height', 10);

      expect(testSubject2).to.have.property('width', 5);
      expect(testSubject2).to.have.property('height', 5);

    });
  });
});
