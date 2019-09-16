/* eslint-disable no-undef */

import Component from '@ember/component';
import {computed, observer} from '@ember/object';
import {inject as service} from '@ember/service';
import chartTheme from 'adaptone-front/constants/chart-theme';

const EQ_GAINS_SERIE_INDEX = 0;
const AMPLITUDES_SERIE_INDEX = 1;
const ADDED_AMPLITUDES_SERIE_INDEX = 2;

const GRAPH_HEIGHT = '350px';
const GAIN_TICK_INTERVAL = 5;
const GAIN_ZERO_VALUE = 0;
const GAIN_ZERO_WIDTH = 1;
const GAIN_ZERO_ZINDEX = 3;
const MIN_FREQUENCY_VALUE = 20;
const MAX_FREQUENCY_VALUE = 20000;

export default Component.extend({
  intl: service(),
  packetDispatcher: service('packet-dispatcher'),

  isParametric: true,

  channelInfos: null,
  parametricEqValues: null,
  graphicEqValues: null,

  chartOptions: null,
  chartData: null,
  theme: chartTheme,

  spectrums: null,

  currentChannelId: computed('channelInfos.data.channelId', function() {
    return this.channelInfos.data.channelId;
  }),

  eqGains: computed('isParametric', function() {
    let formattedData = [];

    if (this.get('isParametric')) {
      formattedData = this.get('parametricEqValues');
    } else {
      formattedData = this.get('graphicEqValues');
    }

    return formattedData;
  }),

  channelSpectrums: computed('spectrums.[]', function() {
    const spectrums = this.get('spectrums');

    if (!spectrums) return;

    const formattedData = [];

    const currentChannelSpectrums = spectrums.filter(spectrum => spectrum.channelId === this.get('currentChannelId'))[0];

    currentChannelSpectrums.points.forEach(point => {
      formattedData.push([point.freq, point.amplitude]);
    });

    return formattedData;
  }),

  addedChannelsSpectrums: computed('spectrums.[]', function() {
    const spectrums = this.get('spectrums');

    if (!spectrums) return;

    let formattedData = {};

    spectrums.filter(spectrum => spectrum.channelId !== this.get('currentChannelId')).forEach(spectrum => {
      spectrum.points.forEach(point => {
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

  eqGainsChanged: observer('isParametric', 'parametricEqValues', 'graphicEqValues', function() {
    const chart = Highcharts.charts[Highcharts.charts.length - 1];

    if (!chart) return;

    this.notifyPropertyChange('eqGains');

    chart.series[EQ_GAINS_SERIE_INDEX].setData(this.get('eqGains'), true);
  }),

  spectrumsChanged: observer('spectrums.[].points.[].{freq,amplitude}', 'currentChannelId', function() {
    const chart = Highcharts.charts[Highcharts.charts.length - 1];

    if (!chart) return;

    this.notifyPropertyChange('channelSpectrums');
    this.notifyPropertyChange('addedChannelsSpectrums');

    chart.series[AMPLITUDES_SERIE_INDEX].setData(this.get('channelSpectrums'), true);
    chart.series[ADDED_AMPLITUDES_SERIE_INDEX].setData(this.get('addedChannelsSpectrums'), true);
  }),

  init() {
    this._super(...arguments);

    this.setChartOptions();
  },

  didRender() {
    this._super(...arguments);

    this.get('packetDispatcher').on('input-spectrum', (data) => {
      this.set('spectrums', data.spectrums);
    });

    // TODO : Remove this fake data
    this.set('spectrums', [
      {
        channelId: 2,
        points: [
          {
            freq: 500,
            amplitude: 4
          },
          {
            freq: 1000,
            amplitude: 1
          },
          {
            freq: 2000,
            amplitude: -8
          },
          {
            freq: 4000,
            amplitude: -2
          }
        ]
      },
      {
        channelId: 3,
        points: [
          {
            freq: 500,
            amplitude: 1
          },
          {
            freq: 1000,
            amplitude: 7
          },
          {
            freq: 2000,
            amplitude: -6
          },
          {
            freq: 4000,
            amplitude: 0
          }
        ]
      },
      {
        channelId: 4,
        points: [
          {
            freq: 500,
            amplitude: -1
          },
          {
            freq: 1000,
            amplitude: -3
          },
          {
            freq: 2000,
            amplitude: -12
          },
          {
            freq: 4000,
            amplitude: -5
          }
        ]
      },
      {
        channelId: 5,
        points: [
          {
            freq: 500,
            amplitude: 6
          },
          {
            freq: 1000,
            amplitude: 1
          },
          {
            freq: 2000,
            amplitude: -3
          },
          {
            freq: 4000,
            amplitude: 2
          }
        ]
      }
    ]);
  },

  setChartOptions() {
    const chartOptions = {
      chart: {
        animation: false,
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
        },
        min: MIN_FREQUENCY_VALUE,
        max: MAX_FREQUENCY_VALUE
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
        pointFormat: `<b>${this.intl.t('eq-graph.tooltip.frequency')} :</b> {point.x:,.0f} Hz <br /> <b>${this.intl.t('eq-graph.tooltip.gain')} :</b> {point.y:,.2f} dB`
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: false
          }
        }
      }
    };

    const chartData = [
      {
        name: this.intl.t('eq-graph.series.eq-gain'),
        data: this.get('eqGains')
      },
      {
        name: this.intl.t('eq-graph.series.channel-spectrums'),
        data: this.get('channelSpectrums')
      },
      {
        name: this.intl.t('eq-graph.series.channels-spectrums'),
        data: this.get('addedChannelsSpectrums')
      }
    ];

    this.set('chartOptions', chartOptions);
    this.set('chartData', chartData);
  }
});
