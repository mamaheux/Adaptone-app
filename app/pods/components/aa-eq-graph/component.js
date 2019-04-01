import Component from '@ember/component';
import {inject as service} from '@ember/service';
import chartTheme from 'adaptone-front/constants/chart-theme';

const GRAPH_HEIGHT = '350px';
const GAIN_TICK_INTERVAL = 3;
const GAIN_ZERO_VALUE = 0;
const GAIN_ZERO_WIDTH = 1;
const GAIN_ZERO_ZINDEX = 3;

export default Component.extend({
  intl: service(),

  currentChannelId: null,
  frequencies: null,
  gains: null,
  amplitudes: null,

  chartOptions: null,
  chartData: null,
  theme: chartTheme,

  init() {
    this._super(...arguments);

    this.set('frequencies', [16, 32, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]);
    this.set('gains',[-10, 1, -2, 3.3, 10, 4, 2, 1, -12, 10, 9, 5]);
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
        data: this.formatEQGains()
      },
      {
        name: this.intl.t('eq-graph.series.channel-amplitudes'),
        data: this.formatChannelAmplitudes()
      },
      {
        name: this.intl.t('eq-graph.series.channels-amplitudes'),
        data: this.formateChannelsAmplitudes()
      }
    ];

    this.set('chartOptions', chartOptions);
    this.set('chartData', chartData);
  },

  formatEQGains() {
    const {frequencies, gains} = this.getProperties('frequencies', 'gains');
    const formattedData = [];

    frequencies.forEach((frequency, index) => {
      formattedData.push([frequency, gains[index]]);
    });

    return formattedData;
  },

  formatChannelAmplitudes() {
    const amplitudes = this.get('amplitudes');
    const formattedData = [];

    const currentChannelAmplitudes = amplitudes.filter(amplitude => amplitude.data.channelId === this.get('currentChannelId'))[0];

    currentChannelAmplitudes.data.points.forEach(point => {
      formattedData.push([point.freq, point.amplitude]);
    });

    return formattedData;
  },

  formateChannelsAmplitudes() {
    const amplitudes = this.get('amplitudes');
    let formattedData = {};

    amplitudes.forEach(amplitude => {
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
  }
});
