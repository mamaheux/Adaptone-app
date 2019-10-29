import Component from '@ember/component';
import {inject as service} from '@ember/service';
import steps from 'adaptone-front/models/steps';
import SequenceIds from 'adaptone-front/constants/sequence-ids';
import $ from 'jquery';
import {run} from '@ember/runloop';

import config from 'adaptone-front/config/environment';

const MAX_LIST_HEIGHT = 300;

export default Component.extend({
  fileSystem: service('file-system'),
  router: service('router'),
  session: service('session'),
  connection: service('connection'),

  configurations: null,

  attached: false,
  lastPosition: null,

  init() {
    this._super(...arguments);

    const result = this.get('fileSystem').readFile(config.APP.CONFIGURATION_FILE.FILENAME);
    const configs = result.success ? result.data : [];

    this.set('configurations', configs);
  },

  didInsertElement() {
    this._super(...arguments);

    $('.list-elements').on('mousedown mouseup mousemove', (e) => {
      if (e.type === 'mousedown') {
        this.set('attached', true);
        this.set('lastPosition', e.clientY);
      }

      if (e.type === 'mouseup') this.set('attached', false);

      if (e.type === 'mousemove' && this.get('attached')) {
        const posY = e.clientY;
        const lastPosition = this.get('lastPosition');
        const deltaY = posY - lastPosition;

        $('.list-elements').scrollTop($('.list-elements').scrollTop() - deltaY);

        this.set('lastPosition', e.clientY);
      }
    });

    $(window).on('mouseup', () => {
      run(() => {
        this.set('attached', false);
      });
    });

    if ($('.list-elements').height() >= MAX_LIST_HEIGHT) {
      $('.bottom-shadow').addClass('shadow-active');
      $('.configuration-list').addClass('scrollable');
      $('.list-elements').addClass('scrollable');
    }

    $('.list-elements').scroll(() => {
      if ($('.list-elements').scrollTop() + $('.list-elements').height() >= $('.list-elements')[0].scrollHeight) {
        $('.bottom-shadow').removeClass('shadow-active');
        $('.top-shadow').addClass('shadow-active');
      } else {
        $('.bottom-shadow').addClass('shadow-active');
        $('.top-shadow').removeClass('shadow-active');
      }
    });
  },

  willDestroyElement() {
    $('.list-elements').off('mousedown mouseup mousemove');
    $(window).off('mouseup');
  },

  actions: {
    addConfig() {
      this.get('router').transitionTo('initial-parameters');
    },

    removeConfig(configurationId) {
      const configurations = this.get('fileSystem').removeConfiguration(configurationId);

      this.set('configurations', configurations);
    },

    selectConfig(configuration) {
      this.get('session').set('configuration', configuration);

      this.get('connection').sendMessage({
        seqId: SequenceIds.CONFIG_CHOICE,
        data: configuration
      });

      this.get('router').transitionTo('console');
      // TODO: Re-enable this when we actually want to navigate through the steps
      // this._routeStep(configuration.step);
    }
  },

  _routeStep(configurationStep) {
    const stepRoute = Object.keys(steps).find(key => steps[key] === configurationStep);

    this.router.transitionTo(stepRoute);
  }
});
