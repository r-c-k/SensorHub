class STREAM {

  constructor (_root) {

    this.firstRoot = _root;
    this.root = _root;

    this.streamLabel = '';

    this.id = '';

    this.location = {};
    this.marker = new google.maps.Marker({
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      icon: './includes/media/marker.png'
    });;

    this.lastUpdate = Date.now();

    this.datasets = {};
    this.charts = {};
  }

  addData (_obj, _timestamp) {


    let key = Object.keys(_obj)[0];
    let value = Object.values(_obj)[0];

    if (this.datasets[key] != undefined) {

      // add value to known key
      this.datasets[key].push(value);
    } else {

      // add new key-value pair
      this.datasets[key] = [value];

      // context for chart
      let context = document.getElementById(this.root + '_' + key + '_ctx').getContext('2d');
      this.charts[key] = this.newChart(context);
    }

    // update the chart
    this.updateChart(this.charts[key], _timestamp, parseFloat(value));
  }

  newChart (_context) {

    let chart = new Chart(_context, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
              data: [],
              backgroundColor: [
                    'rgb(94, 162, 218)'
                ]
            }]
        },
        options: {
          tooltips: {
            enabled: false
          },
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: false
            }],
            yAxes: [{
              display: false,
              ticks: {
                    beginAtZero:true
                }
            }]
          }
        }
    });

    return chart;
  }

  updateChart (_chart, _label, _data) {
    _chart.data.labels.push(_label);
    _chart.data.datasets.forEach((_ds) => {
        _ds.data.push(_data);
    });
    _chart.update();
  }

}

module.exports = STREAM;
