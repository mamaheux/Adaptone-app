import PositionsMap from '../aa-positions-map/component';
import h337 from 'heatmap.js';
import {inject as service} from '@ember/service';
import {set} from '@ember/object';
import SequenceIds from 'adaptone-front/constants/sequence-ids';
import $ from 'jquery';
import {run} from '@ember/runloop';

const MIC_ICON_X_OFFSET = 15;
const MIC_ICON_Y_OFFSET = 20;

const GREEN_GRADIENT_COLOR = '#09131a';
const YELLOW_GRADIENT_COLOR = '#00254f';
const RED_GRADIENT_COLOR = '#006eee';

export default PositionsMap.extend({
  connection: service('connection'),
  probeStatePersister: service('probe-state-persister'),

  radius: null,
  max: null,
  min: null,

  didInsertElement() {
    this._super(...arguments);

    const canvasWrapper = this.element.querySelector('.canvas-wrapper');
    this.generateHeatMap(canvasWrapper);

    $(window).on('resize', () => {
      run(() => {
        this.generateHeatMap(canvasWrapper);
      });
    });
  },

  willDestroyElement() {
    this.get('packetDispatcher').off('error-rates');
    $(window).off('resize');
  },

  generateHeatMap(canvasWrapper) {
    const {micPositions, radius} = this.getProperties('micPositions', 'radius');
    const config = {
      container: canvasWrapper,
      backgroundColor: GREEN_GRADIENT_COLOR,
      radius,
      gradient: {
        0: GREEN_GRADIENT_COLOR,
        0.5: YELLOW_GRADIENT_COLOR,
        1: RED_GRADIENT_COLOR
      }
    };

    const heatMap = h337.create(config);
    const {min, max} = this.getProperties('min', 'max');

    heatMap.setData({
      max,
      min,
      data: []
    });

    const probeState = this.get('probeStatePersister').get('state');

    micPositions.forEach(micPosition => {
      if (probeState) {
        const probe = probeState.find(p => p.id === micPosition.id);
        set(micPosition, 'selected', probe && probe.selected);
      }

      heatMap.addData({
        x: micPosition.x + MIC_ICON_X_OFFSET,
        y: micPosition.y + MIC_ICON_Y_OFFSET,
        value: micPosition.errorRate
      });
    });
  },

  actions: {
    selectMicrophone(microphone) {
      const micPositions = this.get('micPositions');

      micPositions.forEach(micPosition => {
        const selected = (microphone.id === micPosition.id) && !microphone.selected;
        set(micPosition, 'selected', selected);

        if (selected) {
          this.get('connection').sendMessage({
            seqId: SequenceIds.PROBE_LISTEN,
            data: {
              probeId: microphone.id
            }
          });
        }
      });

      if (!microphone.selected) {
        this.get('connection').sendMessage({
          seqId: SequenceIds.STOP_PROBE_LISTEN
        });
      }

      this.set('micPositions', micPositions);
      this.get('probeStatePersister').set('state', micPositions);
    }
  }
});
