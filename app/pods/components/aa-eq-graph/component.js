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
const MIN_GAIN_VALUE = -25;
const MAX_GAIN_VALUE = 25;

export default Component.extend({
  intl: service(),

  isParametric: true,

  amplitudes: null,
  channelInfos: null,
  parametricEqValues: null,
  graphicEqValues: null,

  chartOptions: null,
  chartData: null,
  theme: chartTheme,

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

  channelAmplitudes: computed('amplitudes', function() {
    const amplitudes = this.get('amplitudes');

    // TODO: Remove this condition
    if (amplitudes) {
      const formattedData = [];

      const currentChannelAmplitudes = amplitudes.filter(amplitude => amplitude.data.channelId === this.get('currentChannelId'))[0];

      currentChannelAmplitudes.data.points.forEach(point => {
        formattedData.push([point.freq, point.amplitude]);
      });

      return formattedData;
    }
  }),

  addedChannelsAmplitudes: computed('amplitudes', function() {
    const amplitudes = this.get('amplitudes');

    // TODO: Remove this condition
    if (amplitudes) {
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
    }
  }),

  eqGainsChanged: observer('isParametric', 'parametricEqValues', 'graphicEqValues', function() {
    const chart = Highcharts.charts[Highcharts.charts.length - 1];
    this.notifyPropertyChange('eqGains');

    chart.series[EQ_GAINS_SERIE_INDEX].setData(this.get('eqGains'), true);
  }),

  channelAmplitudesChanged: observer('amplitudes.data.points.@each.amplitude', 'currentChannelId', function() {
    // TODO: Remove this condition
    if (this.get('amplitudes')) {
      const chart = Highcharts.charts[Highcharts.charts.length - 1];
      this.notifyPropertyChange('channelAmplitudes');

      chart.series[AMPLITUDES_SERIE_INDEX].setData(this.get('channelAmplitudes'), true);
    }
  }),

  addedChannelsAmplitudesChanged: observer('amplitudes.data.points.@each.amplitude', 'currentChannelId', function() {
    // TODO: Remove this condition
    if (this.get('amplitudes')) {
      const chart = Highcharts.charts[Highcharts.charts.length - 1];
      this.notifyPropertyChange('addedChannelsAmplitudes');

      chart.series[ADDED_AMPLITUDES_SERIE_INDEX].setData(this.get('addedChannelsAmplitudes'), true);
    }
  }),

  init() {
    this._super(...arguments);

    this.setChartOptions();
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
