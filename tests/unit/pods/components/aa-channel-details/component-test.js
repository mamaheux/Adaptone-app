import {expect} from 'chai';
import {describe, it, beforeEach} from 'mocha';
import {setupTest} from 'ember-mocha';
import Channels from 'adaptone-front/constants/channels';

describe('Unit | Component | aa-channel-details', function() {
  setupTest();

  let component;
  let hideChannelDetailsSpy = sinon.spy();
  let onChannelMuteChangeSpy = sinon.spy();
  let onChannelSoloChangeSpy = sinon.spy();
  
  beforeEach(function() {
    const channel = {
      data: {
        channelId: 1,
        auxiliaryChannelId: null,
        channelName: 'Input 1',
        gain: 3.00,
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

    component = this.owner.factoryFor('component:aa-channel-details').create({
      channel,
      hideChannelDetails: hideChannelDetailsSpy,
      onChannelMuteChange: onChannelMuteChangeSpy,
      onChannelSoloChange: onChannelSoloChangeSpy
    });

    Ember.run.debounce = function(target, func, arg, _) {
      func.call(target, arg);
    }
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

    describe('isMasterInput', () => {
      describe('when not master input', () => {
        it('should be false', () => {
          const isMasterInput = component.get('isMasterInput');

          expect(isMasterInput).to.be.false;
        });
      });

      describe('when master input', () => {
        it('should be true', () => {
          component.set('channel', {data: {isMasterInput: true}});
          const isMasterInput = component.get('isMasterInput');

          expect(isMasterInput).to.be.true;
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
  });

  describe('actions', () => {
    describe('onEqChange', () => {
      it('should call update update session configuration', () => {
        const updateSessionConfigurationSpy = sinon.spy();
        component._updateSessionConfiguration = updateSessionConfigurationSpy;
        component.send('onEqChange');

        expect(updateSessionConfigurationSpy.calledOnce).to.be.true;
      });
    });

    describe('onGainChange', () => {
      it('should call update update session configuration and send the gain with the correct message', () => {
        const expectedMessage = {
          seqId: 10,
          data: {
            channelId: 1,
            gain: 1.0592537251772889
          }
        };

        const updateSessionConfigurationSpy = sinon.spy();
        component._updateSessionConfiguration = updateSessionConfigurationSpy;
        
        const connectionSpy = sinon.spy();
        component.connection.sendMessage = connectionSpy;

        component.send('onGainChange', 0.5);

        expect(updateSessionConfigurationSpy.calledOnce).to.be.true;
        expect(connectionSpy.calledWith(expectedMessage)).to.be.true;
      });
    });

    describe('onIsMutedChange', () => {
      it('should call onChannelMuteChange and update session configuration', () => {
        const updateSessionConfigurationSpy = sinon.spy();
        component._updateSessionConfiguration = updateSessionConfigurationSpy;
        component.send('onIsMutedChange');

        expect(updateSessionConfigurationSpy.calledOnce).to.be.true;
        expect(onChannelMuteChangeSpy.calledOnce).to.be.true;
      });
    });
    
    describe('onIsSoloChange', () => {
      it('should call onChannelSoloChange and update session configuration', () => {
        const updateSessionConfigurationSpy = sinon.spy();
        component._updateSessionConfiguration = updateSessionConfigurationSpy;
        component.send('onIsSoloChange');

        expect(updateSessionConfigurationSpy.calledOnce).to.be.true;
        expect(onChannelSoloChangeSpy.calledOnce).to.be.true;
      });
    });
        
    describe('saveConfiguration', () => {
      it('should dump session in file and set hasNewChanges to false', () => {
        const dumpSessionInFileSpy = sinon.spy();
        component.session.dumpSessionInFile = dumpSessionInFileSpy;
        component.send('saveConfiguration');

        expect(dumpSessionInFileSpy.calledOnce).to.be.true;
        expect(component.get('hasNewChanges')).to.be.false;
      });
    });
            
    describe('onEqTabClick', () => {
      it('should set isInputVolumeVisible to false and isEqVisible to true', () => {
        component.send('onEqTabClick');

        expect(component.get('isInputVolumeVisible')).to.be.false;
        expect(component.get('isEqVisible')).to.be.true;
      });
    });
                
    describe('onInputVolumeTabClick', () => {
      it('should set isInputVolumeVisible to true and isEqVisible to false', () => {
        component.send('onInputVolumeTabClick');

        expect(component.get('isInputVolumeVisible')).to.be.true;
        expect(component.get('isEqVisible')).to.be.false;
      });
    });
                    
    describe('onInputChannelMuteChange', () => {
      it('should update session configuration and send the gain with the correct message', () => {
        const auxiliaryChannel = Channels.auxiliaryTemplate;
        component.set('channel', auxiliaryChannel);

        const expectedMessage = {
          seqId: 15,
          data: {
            channelId: 5,
            gain: 0
          }
        };

        const updateSessionConfigurationSpy = sinon.spy();
        component._updateSessionConfiguration = updateSessionConfigurationSpy;
        
        const connectionSpy = sinon.spy();
        component.connection.sendMessage = connectionSpy;
        component.send('onInputChannelMuteChange', auxiliaryChannel.data.inputs[0].data);

        expect(updateSessionConfigurationSpy.calledOnce).to.be.true;
        expect(connectionSpy.calledWith(expectedMessage)).to.be.true;
      });
    });
                        
    describe('onInputChannelSoloChange', () => {
      it('should set isInputVolumeVisible to true and isEqVisible to false', () => {
        const auxiliaryChannel = Channels.auxiliaryTemplate;
        auxiliaryChannel.data.inputs[0].data.gain = 3;
        auxiliaryChannel.data.inputs[0].data.isSolo = true;

        component.set('channel', auxiliaryChannel);


        const expectedMessage = {
          seqId: 16,
          data: {
            gains: [
              {
                channelId: 1,
                gain: 3
              },
              {
                channelId: 2,
                gain: 0
              },
              {
                channelId: 3,
                gain: 0
              },
              {
                channelId: 4,
                gain: 0
              }
            ]
          }
        };

        const updateSessionConfigurationSpy = sinon.spy();
        component._updateSessionConfiguration = updateSessionConfigurationSpy;
        
        const connectionSpy = sinon.spy();
        component.connection.sendMessage = connectionSpy;
        component.send('onInputChannelSoloChange');

        expect(updateSessionConfigurationSpy.calledOnce).to.be.true;
        expect(connectionSpy.calledWith(expectedMessage)).to.be.true;
      });
    });
  });
});
