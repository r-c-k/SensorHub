const {ipcRenderer} = require('electron');
const STREAM = require('./classes/stream');
const DATASET = require('./classes/dataset');

let streams = [];
let selected = null;
let map;

function init() {

  let location = {lat: 40.65, lng: -73.91};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: location,
    streetViewControl: false
  });

  /* prototyping */
  if (streams.length == 0) {
    let ROOTS = ['KZABFGSHAVFQVTWAETNKXSLTIIHKTLIWKILGCCVXHHAMBTOHGWI9ZQKWZCBYUFAXVTYMATNWDSKVMDUXG',
                  'YFWBLCWISCETHIWPQXLICUPRNHSKUKUUCTLW9ZDRYLXALEGVQYEOCHQWZFMNWJPWAVPBRGUSCWKLHLJTX',
                    'FI99UEVFYDEYNJORHPZBWEWLHVE9OSMCXZVUZAGNFZJWOEMOCORUNACHWJTRIOSEDOVIHXOQACHNPLJCP']

    ROOTS.forEach(root => {
      addStream(root);
    })

    fetchStream(0);
  }
}

$("#quickAdd").keypress(function (_e) {
  if (_e.which === 13 && _e.target.value != '') {

    addStream(_e.target.value);
    _e.target.value = '';

    //fetchStream(0);
  }
});

ipcRenderer.on('setRoot', (event, id, _newRoot) => {

  streams[id].root = _newRoot;
  /* next stream */
  setTimeout(fetchStream, 500, id+1);
});

ipcRenderer.on('fetchPacket', (event, _packet, id) => {

  if (streams[id].location == null) {
    let location = {lat: _packet.location.lat, lng: _packet.location.lng};
    var marker = new google.maps.Marker({
      position: location,
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP
    });

    selected = id;
  }

  $('#' + streams[id].streamLabel).html(_packet.id);
  streams[id].id = _packet.id;
  streams[id].location = {lat: _packet.location.lat, lng: _packet.location.lng}
  streams[id].lastUpdate = _packet.timestamp;
  streams[id].data = _packet.data;

  if (selected != null && selected == id) {
    select(id);
  }
});

function fetchStream (id) {

  if (id > streams.length - 1) {
    id = 0;
  }

  highlight(id);
  ipcRenderer.send('fetchRoot', streams[id].root, id);
}

function select (id) {

  $('#stream_nav > div').each(function () {
    $(this).removeClass('active');
  });

  $('#label_' + id).addClass('active');
  selected = id;

  map_panTo(streams[id].location);
  debug();
}

function addStream (root) {
  let s = new STREAM(root);
  let id = streams.length;
  s.streamLabel= 'label_' + id + '_title';
  streams.push(s);

  $('#stream_nav').append('<div class="stream_label" id="label_' + id + '" onclick="select(' + id + ');">' + '<h5 id="' + s.streamLabel+ '">...' + '</h5><span id="sync_indicator_' + id + '" class="label label-white">< 10 sec<span></div>');
}

function map_panTo (location) {
  map.panTo(location);
}

function debug () {

 if (streams[selected].data[0] == undefined)
  return;

  $('#title').text(streams[selected].id);
  $('#loc').text('Lat: ' + streams[selected].location.lat + ' Long: ' + streams[selected].location.lng);
  $('#temp').text(streams[selected].data[0].temperature);
  $('#press').text(streams[selected].data[0].pressure);
  $('#hum').text(streams[selected].data[0].humidity);
  $('#gas').text(streams[selected].data[0].gasResistance);
}

function highlight (id) {

  $('#stream_nav > div > span').each(function () {
    $(this).removeClass('highlight');
  });

  $('#sync_indicator_' + id).addClass('highlight');
}
