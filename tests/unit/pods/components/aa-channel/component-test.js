import {expect} from 'chai';
import {describe, it, beforeEach} from 'mocha';
import {setupTest} from 'ember-mocha';
import Channels from 'adaptone-front/constants/channels';

describe('Unit | Component | aa-channel', function() {
  setupTest();

  let component;
  const onChannelMuteChangeSpy = sinon.spy();
  const onChannelSoloChangeSpy = sinon.spy();
  const onGainChangeSpy = sinon.spy();
  const showChannelDetailsSpy = sinon.spy();
  const originalDebounce = Ember.run.debounce;
  
  beforeEach(function() {
    const channel = {
      data: {
        channelId: 1,
        auxiliaryChannelId: null,
        channelName: 'Input 1',
        gain: 0.1,
        isMuted: false,
        isSolo: false,
        paramEq: [
          {
            id: 0,
            on: true,
            freq: 100,
            q: 1,
            gain: 0
          },
          {
            id: 1,
            on: true,
            freq: 300,
            q: 5,
            gain: 0
          },
          {
            id: 2,
            on: true,
            freq: 800,
            q: 5,
            gain: 0
          },
          {
            id: 3,
            on: true,
            freq: 1500,
            q: 5,
            gain: 0
          },
          {
            id: 4,
            on: true,
            freq: 8000,
            q: 1,
            gain: 0
          }
        ],
        graphEq: [
          {
            id: 0,
            value: 0
          },
          {
            id: 0,
            value: 0
          },
          {
            id: 0,
            value: 0
          },
          {
            id: 0,
            value: 0
          },
          {
            id: 0,
            value: 0
          }
        ],
        eqGains: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      }
    };

    component = this.owner.factoryFor('component:aa-channel').create({
      channel,
      onChannelMuteChange: onChannelMuteChangeSpy,
      onChannelSoloChange: onChannelSoloChangeSpy,
      onGainChange: onGainChangeSpy,
      showChannelDetails: showChannelDetailsSpy
    });

    Ember.run.debounce = function(target, func, arg, _) {
      func.call(target, arg);
    }
  });
  
  afterEach(function() {
    Ember.run.debounce = originalDebounce;
    onChannelMuteChangeSpy.resetHistory();
    onChannelSoloChangeSpy.resetHistory();
    onGainChangeSpy.resetHistory();
    showChannelDetailsSpy.resetHistory();
  });

  describe('computed', () => {
        describe('isAuxiliaryInput', () => {
      describe('when not auxiliary input', () => {
        it('should be false', () => {
          const isAuxiliaryInput = component.get('isAuxiliaryInput');

          expect(isAuxiliaryInput).to.be.false;
        });
      });

      describe('when auxiliary input', () => {
        it('should be true', () => {
          component.set('channel', {data: {isAuxiliaryInput: true}});
          const isAuxiliaryInput = component.get('isAuxiliaryInput');

          expect(isAuxiliaryInput).to.be.true;
        });
      });
    });

    describe('isAuxiliaryOutput', () => {
      describe('when not auxiliary output', () => {
        it('should be false', () => {
          const isAuxiliaryOutput = component.get('isAuxiliaryOutput');

          expect(isAuxiliaryOutput).to.be.false;
        });
      });

      describe('when auxiliary output', () => {
        it('should be true', () => {
          component.set('channel', {data: {isAuxiliaryOutput: true}});
          const isAuxiliaryOutput = component.get('isAuxiliaryOutput');

          expect(isAuxiliaryOutput).to.be.true;
        });
      });
    });

    describe('isMasterOutput', () => {
      describe('when not master output', () => {
        it('should be false', () => {
          const isMasterOutput = component.get('isMasterOutput');

          expect(isMasterOutput).to.be.false;
        });
      });

      describe('when master output', () => {
        it('should be true', () => {
          component.set('channel', {data: {isMasterOutput: true}});
          const isMasterOutput = component.get('isMasterOutput');

          expect(isMasterOutput).to.be.true;
        });
      });
    });

    describe('isOutput', () => {
      describe('when not output', () => {
        it('should be false', () => {
          const isOutput = component.get('isOutput');

          expect(isOutput).to.be.false;
        });
      });

      describe('when auxiliary output', () => {
        it('should be true', () => {
          component.set('channel', {data: {isAuxiliaryOutput: true}});
          const isOutput = component.get('isOutput');

          expect(isOutput).to.be.true;
        });
      });
      
      describe('when master output', () => {
        it('should be true', () => {
          component.set('channel', {data: {isMasterOutput: true}});
          const isOutput = component.get('isOutput');

          expect(isOutput).to.be.true;
        });
      });
    });

    describe('gainValue', () => {
      describe('with master inputs', () => {
        it('should use the gain of the master input channel multiplied by the gain max value', () => {
          component.set('masterInputs', Channels.master.data.inputs);
          const gainValue = component.get('gainValue');

          expect(gainValue).to.equal(0);

          component.set('masterInputs', null);
        });
      });

      describe('without master inputs', () => {
        it('should use the gain of the channel multiplied by the gain max value', () => {
          const gainValue = component.get('gainValue');

          expect(gainValue).to.equal(10);
        });
      });
    });
  });

  describe('observers', () => {
    describe('channelGainChanged', () => {
      describe('with master inputs', () => {
        it('should set the formatted gain in the master input', () => {
          component.set('masterInputs', Channels.master.data.inputs);
          component.set('gainValue', 50);

          expect(component.get('masterInputs')[0].data.gain).to.equal(0.5);
          
          component.set('masterInputs', null);
        });
      });

      describe('without master inputs', () => {
        it('should set the formatted gain in the channel', () => {
          component.set('gainValue', 80);

          expect(component.get('channel').data.gain).to.equal(0.8);
        });
      });

      describe('when the channel is muted', () => {
        it('should not send any message to the connection or to the onGainChange function', () => {
          const connectionSpy = sinon.spy();
          component.connection.sendMessage = connectionSpy;

          component.set('channel.data.isMuted', true);
          component.set('gainValue', 50);

          expect(onGainChangeSpy.called).to.be.false;
          expect(connectionSpy.called).to.be.false;
        });
      });
      
      describe('when a master input channel is solo', () => {
        beforeEach(() => {
          component.set('masterInputs', Channels.master.data.inputs);
          const masterInput = component.get('masterInputs').objectAt(3).data;
          Ember.set(masterInput, 'isSolo', true);
        });

        afterEach(() => {
          component.set('masterInputs', null);
          component.set('channel.data.isSolo', false);
        });

        describe('when the channel is solo', () => {
          it('should send the gain to the connection and the onGainChange function', () => {
            const connectionSpy = sinon.spy();
            component.connection.sendMessage = connectionSpy;

            component.set('channel.data.isSolo', true);
            component.set('gainValue', 50);

            const expectedMessage = {
              seqId: 13,
              data: {
                auxiliaryChannelId: null,
                channelId: 1,
                gain: 0.5
              }
            };
  
            expect(onGainChangeSpy.calledOnce).to.be.true;
            expect(connectionSpy.calledWith(expectedMessage)).to.be.true;
          });
        });
        
        describe('when the channel is not solo', () => {
          it('should not send any message to the connection or the onGainChange function', () => {
            const connectionSpy = sinon.spy();
            component.connection.sendMessage = connectionSpy;

            component.set('gainValue', 66);

            expect(onGainChangeSpy.called).to.be.false;
            expect(connectionSpy.called).to.be.false;
          });
        });
      });
    });
  });

  describe('actions', () => {
    describe('onShowChannelDetailsClick', () => {
      it('should call showChannelDetails', () => {
        component.send('onShowChannelDetailsClick');

        expect(showChannelDetailsSpy.calledOnce).to.be.true;
      });
    });
  })
});
