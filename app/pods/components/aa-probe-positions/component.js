import Component from '@ember/component';
import {inject as service} from '@ember/service';
import steps from 'adaptone-front/models/steps';
import SequenceIds from 'adaptone-front/constants/sequence-ids';

export default Component.extend({
  fileSystem: service('file-system'),
  router: service('router'),
  session: service('session'),
  connection: service('connection'),

  positions: null,
  firstSymmetrySelected: true,

  // TODO: Delete whole init() as this is only used to debug the app without communication
  init() {
    this._super(...arguments);

    const positions = {
      firstSymmetryPositions: [
        {
          x: 0.05,
          y: 0.05,
          type: 's'
        },
        {
          x: 0.9,
          y: 0.05,
          type: 's'
        },
        {
          x: 0.45,
          y: 0.1,
          type: 's'
        },
        {
          id: 0,
          x: 0.05,
          y: 0.1,
          type: 'm',
          errorRate: 0.12
        },
        {
          id: 1,
          x: 0.1,
          y: 0.15,
          type: 'm',
          errorRate: 0.09
        },
        {
          id: 2,
          x: 0.3,
          y: 0.3,
          type: 'm',
          errorRate: 0.07
        },
        {
          id: 3,
          x: 0.5,
          y: 0.15,
          type: 'm',
          errorRate: 0.09
        },
        {
          id: 4,
          x: 0.8,
          y: 0.3,
          type: 'm',
          errorRate: 0.13
        }
      ],
      secondSymmetryPositions: [
        {
          x: 0.05,
          y: 0.05,
          type: 's'
        },
        {
          x: 0.05,
          y: 0.9,
          type: 's'
        },
        {
          x: 0.1,
          y: 0.45,
          type: 's'
        },
        {
          id: 0,
          x: 0.1,
          y: 0.05,
          type: 'm',
          errorRate: 0.12
        },
        {
          id: 1,
          x: 0.15,
          y: 0.1,
          type: 'm',
          errorRate: 0.09
        },
        {
          id: 2,
          x: 0.3,
          y: 0.3,
          type: 'm',
          errorRate: 0.07
        },
        {
          id: 3,
          x: 0.15,
          y: 0.5,
          type: 'm',
          errorRate: 0.09
        },
        {
          id: 4,
          x: 0.3,
          y: 0.8,
          type: 'm',
          errorRate: 0.13
        }
      ]
    };

    this.set('positions', positions);
  },

  actions: {
    rerunInitialization() {
      const configuration = this.get('session').get('configuration');
      configuration.step = steps['probe-initialization'];

      this.get('fileSystem').editConfiguration(configuration);
      this.get('session').set('configuration', configuration);

      this.get('connection').sendMessage({
        seqId: SequenceIds.RERUN_INIT
      });

      this.get('router').transitionTo('probe-initialization');
    },

    confirmPositions() {
      const configuration = this.get('session').get('configuration');
      const {positions, firstSymmetrySelected} = this.getProperties('positions', 'firstSymmetrySelected');

      configuration.step = steps['console-loading:'];

      if (firstSymmetrySelected) {
        configuration.positions = positions.firstSymmetryPositions;
      } else {
        configuration.positions = positions.secondSymmetryPositions;
      }

      this.get('connection').sendMessage({
        seqId: SequenceIds.CONFIG_CHOICE,
        data: configuration
      });

      this.get('fileSystem').editConfiguration(configuration);
      this.get('session').set('configuration', configuration);
      this.get('router').transitionTo('console');

      // This code would be used if we had an optimization routine in place, this is not the case currently
      /*
      const configuration = this.get('session').get('configuration');
      configuration.step = steps.optimization;

      this.get('session').set('configuration', configuration);

      this.get('connection').sendMessage({
        seqId: SequenceIds.CONFIRM,
        data: {
          symmetry: 0
        }
      });

      this.get('fileSystem').editConfiguration(configuration);

      this.get('router').transitionTo('optimization');
      */
    }
  }
});
