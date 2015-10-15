import KeyboardHandler from './keyboardHandler'

let KH;

describe('KeyboardHandler', ()=> {
  beforeEach(()=>{
    KH = new KeyboardHandler();
  });

  describe('#addListener', ()=>{
    it('adds callbacks to the eventCallbacks dictionary', ()=> {
      KH.addListener('test', ()=>{});
      expect(KH.eventCallbacks['test']).to.be.a('function');
    });
  });

  describe('#removeListener', ()=>{
    it('remove callbacks from the eventCallbacks dictionary', ()=> {
      KH.addListener('test', ()=>{});
      KH.removeListener('test');
      expect(KH.eventCallbacks['test']).to.not.exist;
    });
  });

  describe('#processKeys', ()=> {

    it('invokes callbacks for all keys in the keyState dictionary currently set to true', ()=> {

      let callback = sinon.spy();
      let callback2 = sinon.spy();
      let callback3 = sinon.spy();

      KH.addListener('test', callback);
      KH.addListener('test2', callback2);
      KH.addListener('test3', callback3);

      KH.keyState['test'] = true;
      KH.keyState['test2'] = true;
      KH.keyState['test3'] = false;

      KH.processKeys();

      expect(callback.called).to.equal(true);
      expect(callback2.called).to.equal(true);
      expect(callback3.called).to.equal(false);

    });
  });
});
