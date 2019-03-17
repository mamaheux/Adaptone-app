import {expect} from 'chai';
import {describe, it, beforeEach} from 'mocha';
import {setupTest} from 'ember-mocha';
import sinon from 'sinon';

describe('Unit | Services | connection', () => {
  setupTest('service:connection', {
    needs: ['service:websockets', 'service:packet-dispatcher']
  });

  let service;
  let websocketServiceStub;
  const websocket = 'ws://localhost:3201';

  beforeEach(function() {
    service = this.subject();

    websocketServiceStub = sinon.stub(service.get('websockets'), 'socketFor').callsFake(() => {
      return {
        on: function(){}
      }
    });
  });

  afterEach(() => {
    websocketServiceStub.restore();
  });

  it('should create a connection to the websocket', () => {
    service.createConnection(websocket);
    expect(service.get('socketRef')).to.not.equal(null);
  });
});
