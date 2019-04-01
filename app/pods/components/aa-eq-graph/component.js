import Component from '@ember/component';
import {computed} from '@ember/object';
import {inject as service} from '@ember/service';
import chartTheme from 'adaptone-front/constants/chart-theme';

const GRAPH_HEIGHT = '350px';
const GAIN_TICK_INTERVAL = 3;
const GAIN_ZERO_VALUE = 0;
const GAIN_ZERO_WIDTH = 1;
const GAIN_ZERO_ZINDEX = 3;

export default Component.extend({
  intl: service(),

  isParametric: true,
  currentChannelId: null,
  channelInfos: null,
  amplitudes: null,

  chartOptions: null,
  chartData: null,
  theme: chartTheme,

  eqGains: computed('channelInfos.data.{paramEq,graphEq}.@each', 'isParametric', function() {
    const channelInfos = this.get('channelInfos');
    let formattedData = [];

    if (this.get('isParametric')) {
      channelInfos.data.paramEq.forEach(paramEq => {
        formattedData.push([paramEq.freq, paramEq.gain])
      });
    } else {
      channelInfos.data.graphEq.forEach(graphEq => {
        formattedData.push([graphEq.freq, graphEq.value])
      });
    }

    return formattedData;
  }),

  channelAmplitudes: computed('amplitudes.data.points.@each.amplitude', 'currentChannelId', function() {
    const amplitudes = this.get('amplitudes');
    const formattedData = [];

    const currentChannelAmplitudes = amplitudes.filter(amplitude => amplitude.data.channelId === this.get('currentChannelId'))[0];

    currentChannelAmplitudes.data.points.forEach(point => {
      formattedData.push([point.freq, point.amplitude]);
    });

    return formattedData;
  }),

  addedChannelsAmplitudes: computed('amplitudes.data.points.@each.amplitude', 'currentChannelId', function() {
    const amplitudes = this.get('amplitudes');
    let formattedData = {};

    amplitudes.filter(amplitude => amplitude.data.channelId !== this.get('currentChannelId')).forEach(amplitude => {
      amplitude.data.points.forEach(point => {
        if (formattedData[point.freq]) {
          formattedData[point.freq] += point.amplitude;
        } else {
          formattedData[point.freq] = point.amplitude;
        }
      });
    });

    formattedData = Object.keys(formattedData).map((key) => {
      return [Number(key), Number(formattedData[key])];
    });

    return formattedData;
  }),

  init() {
    this._super(...arguments);

    this.set('channelInfos', {
      seqId: 10,
      data: {
        channelId: 1,
        channelName: "Master",
        gain: 75,
        volume: 100,
        isMuted: false,
        isSolo: false,
        paramEq: [
          {
            id: 0,
            on: true,
            freq:  20,
            q: 4.4,
            gain: -6
          },
          {
            id: 1,
            on: true,
            freq:  100,
            q: 4.4,
            gain: 3
          },
          {
            id: 2,
            on: true,
            freq:  200,
            q: 4.4,
            gain: 4
          },
          {
            id: 3,
            on: true,
            freq: 300,
            q: 4.4,
            gain: 5
          },
          {
            id: 4,
            on: true,
            freq:  1000,
            q: 4.4,
            gain: 4
          }
        ],
        graphEq: [
          {
            id: 0,
            freq: 10,
            value: -3
          },
          {
            id: 0,
            freq: 100,
            value: 3
          },
          {
            id: 0,
            freq: 200,
            value: 6
          }
        ]
      }
    }),
    this.set('currentChannelId', 1);
    this.set('amplitudes', [{
      seqId: 12,
      data: {
        channelId: 1,
        points: [
          {
            freq: 16,
            amplitude: -6
          },
          {
            freq: 32,
            amplitude: 5
          },
          {
            freq: 63,
            amplitude: 6
          },
          {
            freq: 125,
            amplitude: 5
          },
          {
            freq: 250,
            amplitude: 6
          },
          {
            freq: 500,
            amplitude: -5
          },
          {
            freq: 1000,
            amplitude: 2
          },
          {
            freq: 2000,
            amplitude: 3
          },
          {
            freq: 4000,
            amplitude: -5
          },
          {
            freq: 8000,
            amplitude: -6
          },
          {
            freq: 16000,
            amplitude: -10
          }
        ]
      }
    },
    {
      seqId: 12,
      data: {
        channelId: 2,
        points: [
         {
            freq: 16,
            amplitude: -6
          },
          {
            freq: 32,
            amplitude: 5
          },
          {
            freq: 63,
            amplitude: 6
          },
          {
            freq: 125,
            amplitude: 5
          },
          {
            freq: 250,
            amplitude: 6
          },
          {
            freq: 500,
            amplitude: -5
          },
          {
            freq: 1000,
            amplitude: 2
          },
          {
            freq: 2000,
            amplitude: 3
          },
          {
            freq: 4000,
            amplitude: -5
          },
          {
            freq: 8000,
            amplitude: -6
          },
          {
            freq: 16000,
            amplitude: -10
          }
        ]
      }
    },
      {
      seqId: 12,
      data: {
        channelId: 3,
        points: [
         {
            freq: 16,
            amplitude: -6
          },
          {
            freq: 32,
            amplitude: 5
          },
          {
            freq: 63,
            amplitude: 6
          },
          {
            freq: 125,
            amplitude: 5
          },
          {
            freq: 250,
            amplitude: 6
          },
          {
            freq: 500,
            amplitude: -5
          },
          {
            freq: 1000,
            amplitude: 2
          },
          {
            freq: 2000,
            amplitude: 3
          },
          {
            freq: 4000,
            amplitude: -5
          },
          {
            freq: 8000,
            amplitude: -6
          },
          {
            freq: 16000,
            amplitude: -10
          }
        ]
      }
    }
    ]);

    this.setChartOptions();
  },

  setChartOptions() {
    const chartOptions = {
      chart: {
        type: 'spline',
        height: GRAPH_HEIGHT
      },
      title: {
        text: ''
      },
      xAxis: {
        type: 'logarithmic',
        title: {
          text: this.intl.t('eq-graph.axis.frequency')
        }
      },
      yAxis: {
        tickInterval: GAIN_TICK_INTERVAL,
        title: {
          text: this.intl.t('eq-graph.axis.gain')
        },
        plotLines: [{
          value: GAIN_ZERO_VALUE,
          color: 'rgba(245, 245, 245, 0.3)',
          width: GAIN_ZERO_WIDTH,
          zIndex: GAIN_ZERO_ZINDEX
        }]
      },
      tooltip: {
        headerFormat: '<b>{series.name}</b><br />',
        pointFormat: `<b>${this.intl.t('eq-graph.tooltip.frequency')} :</b> {point.x} Hz <br /> <b>${this.intl.t('eq-graph.tooltip.gain')} :</b> {point.y} dB`
      }
    };

    const chartData = [
      {
        name: this.intl.t('eq-graph.series.eq-gain'),
        data: this.get('eqGains')
      },
      {
        name: this.intl.t('eq-graph.series.channel-amplitudes'),
        data: this.get('channelAmplitudes')
      },
      {
        name: this.intl.t('eq-graph.series.channels-amplitudes'),
        data: this.get('addedChannelsAmplitudes')
      }
    ];

    this.set('chartOptions', chartOptions);
    this.set('chartData', chartData);
  }
});
