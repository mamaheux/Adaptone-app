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
const DB_FACTOR = 20;
const MAX_DB_VALUE = 25;
const MIN_DB_VALUE = -30;
const NORMALIZED_MAX_DB_VALUE = 15;
const NORMALIZED_MIN_DB_VALUE = -15;
const GAIN_FACTOR = 8;

const convertToDb = (value) => DB_FACTOR * Math.log10(value);
const normalizeValue = (value) => ((value - NORMALIZED_MIN_DB_VALUE) / (NORMALIZED_MAX_DB_VALUE - NORMALIZED_MIN_DB_VALUE)) * GAIN_FACTOR;

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

    let {parametricEqValues, graphicEqValues} = this.getProperties('parametricEqValues', 'graphicEqValues');

    if (!parametricEqValues || !graphicEqValues) return;

    if (this.get('isParametric')) {
      parametricEqValues = parametricEqValues.slice(1);
      formattedData = parametricEqValues;
    } else {
      graphicEqValues = graphicEqValues.slice(1);
      formattedData = graphicEqValues;
    }

    return formattedData;
  }),

  channelSpectrums: computed('spectrums.[]', function() {
    const spectrums = this.get('spectrums');

    if (!spectrums || this.get('isOutput')) return;

    const formattedData = [];

    const currentChannelSpectrums = spectrums.filter(spectrum => spectrum.channelId === this.get('currentChannelId'))[0];

    currentChannelSpectrums.points = currentChannelSpectrums.points.slice(1);

    currentChannelSpectrums.points.forEach(point => {
      if (point.amplitude === 0) return;

      formattedData.push([point.freq, normalizeValue(convertToDb(point.amplitude))]);
    });

    return formattedData;
  }),

  addedChannelsSpectrums: computed('spectrums.[]', function() {
    const spectrums = this.get('spectrums');

    if (!spectrums || this.get('isOutput')) return;

    let formattedData = {};

    spectrums.filter(spectrum => spectrum.channelId !== this.get('currentChannelId')).forEach(spectrum => {
      spectrum.points = spectrum.points.slice(1);

      spectrum.points.forEach(point => {
        if (point.amplitude === 0) return;

        if (formattedData[point.freq]) {
          formattedData[point.freq] += normalizeValue(convertToDb(point.amplitude));
        } else {
          formattedData[point.freq] = normalizeValue(convertToDb(point.amplitude));
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
      if (!data) return;

      this.set('spectrums', data.spectrums);
    });
  },

  willDestroyElement() {
    this.get('packetDispatcher').off('input-spectrum');
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
        }],
        min: MIN_DB_VALUE,
        max: MAX_DB_VALUE
      },
      tooltip: {
        headerFormat: '<b>{series.name}</b><br />',
        pointFormat: `<b>${this.intl.t('eq-graph.tooltip.frequency')} :</b> {point.x:,.0f} Hz <br /> <b>${this.intl.t('eq-graph.tooltip.gain')} :</b> {point.y:,.2f} dB`
      },
      plotOptions: {
        series: {
          animation: {
            duration: 50
          }
        },
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
