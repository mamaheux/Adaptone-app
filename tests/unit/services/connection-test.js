import {expect} from 'chai';
import {describe, it, beforeEach} from 'mocha';
import {setupTest} from 'ember-mocha';

describe('Unit | Services | connection', () => {
  setupTest('service:connection', {
    needs: ['service:websockets']
  });

  let service;
  const websocket = 'ws://localhost:3201';

  beforeEach(function() {
    service = this.subject();
  });

  it('should create a connection to the websocket', () => {
    service.createConnection(websocket);
    expect(service.get('socketRef')).to.not.equal(null);
  });
});
