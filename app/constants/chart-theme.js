const chartTheme = {
  colors: ['#006eee', '#ee9700', '#bd3cda', '#00ee7f', '#eed200', '#ee0038'],
  chart: {
    backgroundColor: {
      linearGradient: {x1: 0.5, y1: 0, x2: 0.5, y2: 0.5},
      stops: [
        [0, '#323c4a'],
        [1, '#222933']
      ]
    },
    className: 'dark-container'
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
    gridLineColor: 'rgba(255, 255, 255, 0.05)',
    gridLineWidth: 1,
    labels: {
      style: {
        color: '#fff'
      }
    },
    lineColor: '#fff',
    tickColor: '#fff',
    title: {
      style: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '20px',
        fontFamily: 'Open Sans, sans-serif'

      }
    }
  },
  yAxis: {
    gridLineColor: 'rgba(255, 255, 255, 0.05)',
    labels: {
      style: {
        color: '#fff'
      }
    },
    lineColor: '#fff',
    minorTickInterval: null,
    tickColor: '#fff',
    tickWidth: 1,
    title: {
      style: {
        color: '#fff',
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
