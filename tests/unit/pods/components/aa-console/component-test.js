import {expect} from 'chai';
import {describe, it, beforeEach} from 'mocha';
import {setupTest} from 'ember-mocha';
import Channels from 'adaptone-front/constants/channels';

describe('Unit | Component | aa-console', function() {
  setupTest();

  let component;
  const originalDebounce = Ember.run.debounce;
  const updateSessionConfigurationSpy = sinon.spy();
  
  beforeEach(function() {
    const auxiliaries = [Channels.auxiliaryTemplate];
    const channels = {
      inputs: Channels.inputs,
      master: Channels.master,
      auxiliaries
    };

    component = this.owner.factoryFor('component:aa-console').create({
      channels
    });

    component._updateSessionConfiguration = updateSessionConfigurationSpy;

    Ember.run.debounce = function(target, func, arg, _) {
      func.call(target, arg);
    }
  });
  
  afterEach(function() {
    Ember.run.debounce = originalDebounce;
    updateSessionConfigurationSpy.resetHistory();
  });

  describe('actions', () => {
    describe('onChannelMuteChange', () => {
      describe('when the channel is not muted', () => {
        describe('when no other channel of the same type is solo', () => {
          it('should update the configuration and send the correct message with the gain', () => {
            const connectionSpy = sinon.spy();
            component.connection.sendMessage = connectionSpy;

            const channel = component.get('channels').inputs[0].data;

            const expectedMessage = {
              seqId: 10,
              data: {
                channelId: 1,
                gain: 1.4125375446227544
              }
            };

            component.send('onChannelMuteChange', channel);

            expect(updateSessionConfigurationSpy.calledOnce).to.be.true;
            expect(connectionSpy.calledWith(expectedMessage)).to.be.true;
          });
        });

        describe('when another channel of the same type is solo', () => {
          beforeEach(() => {
            const channel = component.get('channels').master.data.inputs.objectAt(1).data;
            Ember.set(channel, 'gain', 50);
            Ember.set(channel, 'isSolo', true);
          });

          afterEach(() => {
            const channel = component.get('channels').master.data.inputs.objectAt(1).data;
            Ember.set(channel, 'isSolo', false);
          });

          it('should update the configuration and send the correct message with a gain of 0', () => {
            const connectionSpy = sinon.spy();
            component.connection.sendMessage = connectionSpy;

            const channel = component.get('channels').master.data.inputs.objectAt(0).data;
            Ember.set(channel, 'gain', 40);

            const expectedMessage = {
              seqId: 13,
              data: {
                channelId: 1,
                gain: 0
              }
            };

            component.send('onChannelMuteChange', channel);

            expect(updateSessionConfigurationSpy.calledOnce).to.be.true;
            expect(connectionSpy.calledWith(expectedMessage)).to.be.true;
          });
        });
      });

      describe('when the channel is muted', () => {
        beforeEach(() => {
          const channel = component.get('allChannels').objectAt(0).data;
          Ember.set(channel, 'gain', 50);
          Ember.set(channel, 'isMuted', true);
        });

        afterEach(() => {
          const channel = component.get('allChannels').objectAt(0).data;
          Ember.set(channel, 'isMuted', false);
        });

        it('should update the configuration and send the correct message with a gain of 0', () => {
          const connectionSpy = sinon.spy();
          component.connection.sendMessage = connectionSpy;

          const channel = component.get('allChannels')[0].data;

          const expectedMessage = {
            seqId: 19,
            data: {
              channelId: 0,
              gain: 0
            }
          };

          component.send('onChannelMuteChange', channel);

          expect(updateSessionConfigurationSpy.calledOnce).to.be.true;
          expect(connectionSpy.calledWith(expectedMessage)).to.be.true;
        });
      });
    });

    describe('onChannelSoloChange', () => {
      describe('when the input channel is solo', () => {
        beforeEach(() => {
          const channel = component.get('channels').inputs.objectAt(0).data;
          Ember.set(channel, 'gain', 12);
          Ember.set(channel, 'isSolo', true);
        });

        afterEach(() => {
          const channel = component.get('channels').inputs.objectAt(0).data;
          Ember.set(channel, 'isSolo', false);
        });

        it('should update the configuration and send the correct message', () => {
          const connectionSpy = sinon.spy();
          component.connection.sendMessage = connectionSpy;

          const channel = component.get('channels').inputs.objectAt(0).data;

          const expectedMessage = {
            seqId: 11,
            data: {
              gains: [
                {
                  channelId: 1,
                  gain: 3.9810717055349722
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
                },
              ]
            }
          };

          component.send('onChannelSoloChange', channel);

          expect(updateSessionConfigurationSpy.calledOnce).to.be.true;
          expect(connectionSpy.calledWith(expectedMessage)).to.be.true;
        });
      });

      describe('when the input channel is muted', () => {
        beforeEach(() => {
          const channel = component.get('channels').inputs.objectAt(0).data;
          Ember.set(channel, 'gain', 50);
          Ember.set(channel, 'isSolo', true);
          Ember.set(channel, 'isMuted', true);
        });

        afterEach(() => {
          const channel = component.get('channels').inputs.objectAt(0).data;
          Ember.set(channel, 'isSolo', false);
          Ember.set(channel, 'isMuted', false);
        });

        it('should update the configuration and send the correct message with all gains at 0', () => {
          const connectionSpy = sinon.spy();
          component.connection.sendMessage = connectionSpy;

          const channel = component.get('channels').inputs.objectAt(0).data;

          const expectedMessage = {
            seqId: 11,
            data: {
              gains: [
                {
                  channelId: 1,
                  gain: 0
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
                },
              ]
            }
          };

          component.send('onChannelSoloChange', channel);

          expect(updateSessionConfigurationSpy.calledOnce).to.be.true;
          expect(connectionSpy.calledWith(expectedMessage)).to.be.true;
        });
      });
    });

    describe('onGainChange', () => {
      it('should update the configuration', () => {
        component.send('onGainChange');

        expect(updateSessionConfigurationSpy.calledOnce).to.be.true;
      });
    });

    describe('showChannelDetails', () => {
      it('should set the correct current channel and set isChannelDetailsVisible to true', () => {
        const channel = component.get('channels').inputs.objectAt(0).data;

        component.send('showChannelDetails', channel);

        expect(component.get('currentChannel').channelId).to.equal(channel.channelId);
        expect(component.get('isChannelDetailsVisible')).to.be.true;
      });
    });
        
    describe('hideChannelDetails', () => {
      it('should set the current channel to null and set isChannelDetailsVisible to false', () => {
        component.send('hideChannelDetails');

        expect(component.get('currentChannel')).to.be.null;
        expect(component.get('isChannelDetailsVisible')).to.be.false;
      });
    });

    describe('onUniformizationToggleClick', () => {
      it('should send the correct message', () => {
        const connectionSpy = sinon.spy();
        component.connection.sendMessage = connectionSpy;
        

        component.send('onUniformizationToggleClick');

        const expectedMessage = {
          seqId: 27,
          data: {
            isUniformizationOn: false
          }
        };

        expect(connectionSpy.calledWith(expectedMessage)).to.be.true;
      });
    });
  });
});
