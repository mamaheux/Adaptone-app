import Component from '@ember/component';
import chartTheme from 'adaptone-front/constants/chart-theme';

export default Component.extend({
  frequencies: null,
  gains: null,

  chartOptions: null,
  chartData: null,
  theme: chartTheme,

  init() {
    this._super(...arguments);

    this.set('frequencies', [16, 32, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000]);
    this.set('gains',[-10, 1, -2, 3.3, 10, 4, 2, 1, -12, 10, 9, 5]);

    this.setChartOptions();
  },

  setChartOptions() {
    const chartOptions = {
      chart: {
        type: 'spline'
      },
      title: {
          text: ''
      },
      xAxis: {
          tickInterval: 1,
          type: 'logarithmic',
          title: ''
      },
      yAxis: {
          title: ''
      },
      tooltip: {
          headerFormat: '<b>{series.name}</b><br />',
          pointFormat: '<b>Freq:</b> {point.x} Hz <br /> <b>Gain:</b> {point.y} dB'
      },
      legend: {
        enabled: false
      }
    };

    const chartData = [{
      name: '',
      data: this.getFormattedData()
    }];

    this.set('chartOptions', chartOptions);
    this.set('chartData', chartData);
  },

  getFormattedData() {
    const {frequencies, gains} = this.getProperties('frequencies', 'gains');
    const formattedData = [];

    frequencies.forEach((frequency, index) => {
      formattedData.push([frequency, gains[index]]);
    });

    return formattedData;
  }
});
