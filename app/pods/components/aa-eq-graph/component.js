/* eslint-disable no-undef */

import Component from '@ember/component';
import {computed, observer} from '@ember/object';
import {inject as service} from '@ember/service';
import chartTheme from 'adaptone-front/constants/chart-theme';

const CHART_INDEX = 0;
const EQ_GAINS_SERIE_INDEX = 0;
const AMPLITUDES_SERIE_INDEX = 1;
const ADDED_AMPLITUDES_SERIE_INDEX = 2;

const GRAPH_HEIGHT = '350px';
const GAIN_TICK_INTERVAL = 5;
const GAIN_ZERO_VALUE = 0;
const GAIN_ZERO_WIDTH = 1;
const GAIN_ZERO_ZINDEX = 3;
const MIN_GAIN_VALUE = -60;
const MAX_GAIN_VALUE = 20;

export default Component.extend({
  intl: service(),

  isParametric: true,

  chartOptions: null,
  chartData: null,
  theme: chartTheme,

  currentChannelId: computed('channelInfos.data.channelId', function() {
    return this.channelInfos.data.channelId;
  }),

  eqGains: computed('channelInfos', function() {
    const channelInfos = this.get('channelInfos');
    const formattedData = [];

    if (this.get('isParametric')) {
      channelInfos.data.paramEq.forEach(paramEq => {
        formattedData.push([paramEq.freq, paramEq.gain]);
      });
    } else {
      channelInfos.data.graphEq.forEach(graphEq => {
        formattedData.push([graphEq.freq, graphEq.value]);
      });
    }

    return formattedData;
  }),

  channelAmplitudes: computed('amplitudes', function() {
    const amplitudes = this.get('amplitudes');
    const formattedData = [];

    const currentChannelAmplitudes = amplitudes.filter(amplitude => amplitude.data.channelId === this.get('currentChannelId'))[0];

    currentChannelAmplitudes.data.points.forEach(point => {
      formattedData.push([point.freq, point.amplitude]);
    });

    return formattedData;
  }),

  addedChannelsAmplitudes: computed('amplitudes', function() {
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

  eqGainsChanged: observer('channelInfos.data.{paramEq,graphEq}.@each.{on,freq,q,gain}', 'isParametric', function() {
    const chart = Highcharts.charts[CHART_INDEX];
    this.notifyPropertyChange('eqGains');

    chart.series[EQ_GAINS_SERIE_INDEX].setData(this.get('eqGains'), true);
  }),

  channelAmplitudesChanged: observer('amplitudes.data.points.@each.amplitude', 'currentChannelId', function() {
    const chart = Highcharts.charts[CHART_INDEX];
    this.notifyPropertyChange('channelAmplitudes');

    chart.series[AMPLITUDES_SERIE_INDEX].setData(this.get('channelAmplitudes'), true);
  }),

  addedChannelsAmplitudesChanged: observer('amplitudes.data.points.@each.amplitude', 'currentChannelId', function() {
    const chart = Highcharts.charts[CHART_INDEX];
    this.notifyPropertyChange('addedChannelsAmplitudes');

    chart.series[ADDED_AMPLITUDES_SERIE_INDEX].setData(this.get('addedChannelsAmplitudes'), true);
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
        }
      },
      yAxis: {
        tickInterval: GAIN_TICK_INTERVAL,
        title: {
          text: this.intl.t('eq-graph.axis.gain')
        },
        min: MIN_GAIN_VALUE,
        max: MAX_GAIN_VALUE,
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
