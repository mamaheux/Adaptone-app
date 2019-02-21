import Service, {inject as service} from '@ember/service';
import {later} from '@ember/runloop';

export default Service.extend({
  websockets: service('websockets'),
  socketRef: null,
  isConnected: false,
  exampleData: null,

  createConnection(websocket) {
    const socket = this.get('websockets').socketFor(websocket);

    socket.on('open', this._openHandler, this);
    socket.on('message', this._messageHandler, this);
    socket.on('close', this._closeHandler, this);

    this.set('socketRef', socket);
  },

  disconnect(websocket) {
    this._cleanup();
    this.get('websockets').closeSocketFor(websocket);
  },

  _cleanup() {
    const socket = this.get('socketRef');

    socket.off('open', this._openHandler);
    socket.off('message', this._messageHandler);
    socket.off('close', this._closeHandler);
  },

  _openHandler() {
    this.set('isConnected', true);
  },

  _messageHandler(event) {
    /*
      La logique de séparation des paquets reçus peut être ici ou dans un autre service si ça devient complexe.
      Petit exemple d'utilisation dans un component:

      exempleData: Ember.observer('connection.exampleData', function() {
        console.log('J'ai reçu du data heyo');
      })
    */
    this.set('exampleData', event.data);
  },

  _closeHandler() {
    this.set('isConnected', false);
    const socket = this.get('socketRef');

    later(this, () => {
      socket.reconnect();
    }, 1000);
  },

  sendMessage(message) {
    this.get('socketRef').send(message);
  }
});
