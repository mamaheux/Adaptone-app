const chartTheme = {
  colors: ['#006eee', '#ee9700', '#bd3cda', '#00ee7f', '#eed200', '#ee0038'],
  chart: {
    backgroundColor: {
      linearGradient: {x1: 0, y1: 0, x2: 1, y2: 1},
      stops: [
        [0, '#000'],
        [1, '#003c80']
      ]
    },
    borderColor: '#153244',
    borderWidth: 2,
    className: 'dark-container',
    plotBackgroundColor: 'rgba(255, 255, 255, .1)',
    plotBorderColor: '#f5f5f5',
    plotBorderWidth: 1
  },
  title: {
    style: {
      color: '#f5f5f5',
      font: 'bold 24px "Open Sans", sans-serif'
    }
  },
  subtitle: {
    style: {
      color: '#c0c0c0',
      font: 'bold 18px "Open Sans", sans-serif'
    }
  },
  xAxis: {
    gridLineColor: '#0f2330',
    gridLineWidth: 1,
    labels: {
      style: {
        color: '#f5f5f5'
      }
    },
    lineColor: '#f5f5f5',
    tickColor: '#f5f5f5',
    title: {
      style: {
        color: '#f5f5f5',
        fontWeight: 'bold',
        fontSize: '20px',
        fontFamily: 'Open Sans, sans-serif'

      }
    }
  },
  yAxis: {
    gridLineColor: '#0f2330',
    labels: {
      style: {
        color: '#f5f5f5'
      }
    },
    lineColor: '#f5f5f5',
    minorTickInterval: null,
    tickColor: '#f5f5f5',
    tickWidth: 1,
    title: {
      style: {
        color: '#f5f5f5',
        fontWeight: 'bold',
        fontSize: '20px',
        fontFamily: 'Open Sans, sans-serif'
      }
    }
  },
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    style: {
      color: '#f5f5f5',
      fontFamily: 'Open Sans, sans-serif'
    }
  },
  toolbar: {
    itemStyle: {
      color: 'silver'
    }
  },
  plotOptions: {
    line: {
      dataLabels: {
        color: '#f5f5f5'
      },
      marker: {
        lineColor: '#f5f5f5'
      }
    }
  },
  legend: {
    itemStyle: {
      font: '12pt Open Sans, sans-serif',
      color: '#f5f5f5'
    },
    itemHoverStyle: {
      color: '#f5f5f5'
    },
    itemHiddenStyle: {
      color: '#444'
    }
  },
  credits: {
    enabled: false
  },
  labels: {
    style: {
      color: '#f5f5f5'
    }
  }
};

export default chartTheme;
