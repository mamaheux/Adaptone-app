import Component from '@ember/component';
import {inject as service} from '@ember/service';
import steps from 'adaptone-front/models/steps';
import SequenceIds from 'adaptone-front/constants/sequence-ids';

export default Component.extend({
  fileSystem: service('file-system'),
  router: service('router'),
  session: service('session'),
  connection: service('connection'),
  packetDispatcher: service('packet-dispatcher'),

  isOptimizing: false,

  _routeToConfirmOptimization(data) {
    this.get('router').transitionTo('optimal-positions')
      .then((probeOptimizationRoute) => {
        probeOptimizationRoute.set('controller.model.positions', data.positions);
      });
  },

  actions: {
    startOptimization() {
      this.set('isOptimizing', true);

      this.get('connection').sendMessage({
        seqId: SequenceIds.OPTIMIZE_POS
      });

      this.get('packetDispatcher').one('optimized-positions',  this._routeToConfirmOptimization, this);
    },

    loadConsole() {
      const configuration = this.get('session').get('configuration');
      configuration.step = steps['console-loading:'];

      this.get('fileSystem').editConfiguration(configuration);
      this.get('session').set('configuration', configuration);
      this.router.transitionTo('console-loading');
    }
  }
});
