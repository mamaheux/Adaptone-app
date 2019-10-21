import {expect} from 'chai';
import {describe, it, beforeEach, afterEach} from 'mocha';
import {setupTest} from 'ember-mocha';

describe('Unit | Services | probe-state-persister', () => {
  setupTest('service:probe-state-persister');

  let service;
  const probes = [
    {
      id: 0,
      x: 12,
      y: 16,
      errorRate: 0.22,
      selected: false
    },
    {
      id: 1,
      x: 16,
      y: 25,
      errorRate: 0.12,
      selected: true
    }
  ];

  const expectedValue = [
    {
      id: 0,
      selected: false
    },
    {
      id: 1,
      selected: true
    }
  ];

  describe('persist', () => {
    beforeEach(function() {
      service = this.subject();
    });

    it('should persist the probes state', () => {
      service.set('state', probes);

      expect(service.get('state')).to.deep.equal(expectedValue);
    });
  });

  describe('fetch', () => {
    beforeEach(function() {
      service = this.subject();
      service.set('state', probes);
    });

    it('should fetch the probes state', () => {
      expect(service.get('state')).to.deep.equal(expectedValue);
    });
  });
});
