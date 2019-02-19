import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  websockets: service('websockets'),
  socketRef: null,
  message: null,

  didInsertElement() {
    this._super(...arguments);
    const socket = this.websockets.socketFor('ws://demos.kaazing.com/echo');

    socket.on('open', this.myOpenHandler, this);
    socket.on('message', this.myMessageHandler, this);
    socket.on('close', this.myCloseHandler, this);

    this.set('socketRef', socket);
  },

  willDestroyElement() {
    this._super(...arguments);
    const socket = this.socketRef;

    socket.off('open', this.myOpenHandler);
    socket.off('message', this.myMessageHandler);
    socket.off('close', this.myCloseHandler);
  },

  myOpenHandler() {
    // console.log(`On open event has been called: ${event}`);
  },

  myMessageHandler(event) {
    // console.log(`Message: ${event.data}`);
    this.set('message', event.data);
  },

  myCloseHandler() {
    // console.log(`On close event has been called: ${event}`);
  },

  actions: {
    sendButtonPressed() {
      this.get('socketRef').send('Hello World');
    }
  }
});
