import {expect} from 'chai';
import {describe, it, beforeEach, afterEach} from 'mocha';
import {setupTest} from 'ember-mocha';

import config from 'adaptone-front/config/environment';

describe('Unit | Services | session', () => {
  setupTest('service:session', {
    needs: ['service:file-system']
  });

  let service;
  const configuration = {
    name: 'test',
    monitorCount: 2,
    speakerCount: 8,
    probeCount: 8
  };

  describe('persist', () => {
    beforeEach(function() {
      service = this.subject();
    });

    afterEach(() => {
      localStorage.removeItem(config.APP.LOCAL_STORAGE.SESSION_NAMESPACE);
    });

    it('should persist the configuration to localStorage', () => {
      service.set('configuration', configuration);

      expect(localStorage.getItem(config.APP.LOCAL_STORAGE.SESSION_NAMESPACE)).to.equal(JSON.stringify(configuration));
    });
  });

  describe('fetch', () => {
    beforeEach(function() {
      service = this.subject();
      localStorage.setItem(config.APP.LOCAL_STORAGE.SESSION_NAMESPACE, JSON.stringify(configuration));
    });

    afterEach(() => {
      localStorage.removeItem(config.APP.LOCAL_STORAGE.SESSION_NAMESPACE);
    });

    it('should fetch the configuration from localStorage', () => {
      expect(service.get('configuration')).to.deep.equal(configuration);
    });
  });

  describe('remove', () => {
    beforeEach(function() {
      service = this.subject();
      localStorage.setItem(config.APP.LOCAL_STORAGE.SESSION_NAMESPACE, JSON.stringify(configuration));
    });

    afterEach(() => {
      localStorage.removeItem(config.APP.LOCAL_STORAGE.SESSION_NAMESPACE);
    });

    it('should remove the configuration from localStorage', () => {
      service.remove();

      expect(localStorage.getItem(config.APP.LOCAL_STORAGE.SESSION_NAMESPACE)).to.be.null;
    });
  });
});
