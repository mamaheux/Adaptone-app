'use strict';

module.exports = function(environment) {
  const ENV = {
    modulePrefix: 'adaptone-front',
    podModulePrefix: 'adaptone-front/pods',
    environment,
    rootURL: '/',
    locationType: process.env.EMBER_CLI_ELECTRON ? 'hash' : 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      CONFIGURATION_FILE: {
        FILENAME: 'adaptone-configs.json'
      },
      LOCAL_STORAGE: {
        SESSION_NAMESPACE: 'adaptone-session'
      },
      WEBSOCKET_ADDRESS: 'ws://localhost:8765',
      UNFORMIZATION_DEMO: true
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
    ENV.APP.CONFIGURATION_FILE.FILENAME = 'some-file.json';
    ENV.APP.LOCAL_STORAGE.SESSION_NAMESPACE = 'adaptone-session-test';
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
