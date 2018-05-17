//#############################################
//##              WINDOW LOGIC               ##
//#############################################

const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');

let window;

function createWindow () {

  window = new BrowserWindow({width: 1200, height: 720, show: false})

  window.loadURL(url.format({
    pathname: path.join(__dirname, '/src/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  window.once('ready-to-show', function() {
    getNodeInfo();
    window.show();
  });

  window.setMenu(null);
  //window.webContents.openDevTools();

  window.on('closed', () => {
    window = null;
  })

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (window === null) {
    createWindow();
  }
})


//#############################################
//##                 MAM LOGIC               ##
//#############################################

const IOTA = require('iota.lib.js');
const MAM = require('mam.node.js');

iota = new IOTA({
    'host': 'http://178.238.237.200',
    'port': 14265
});

let root = '';
let streamIndex, data;

// Initialize MAM-state
var mamState = MAM.init(iota);

ipcMain.on('fetchRoot', (event, _root, _i) => {
  root = _root;
  streamIndex = _i;
  execute();
})

const execute = async () => {
  let resp = await MAM.fetch(root, 'public', null, logData).catch(error => {console.log('Cannot fetch stream [' + streamIndex + ']');});
  if (resp == undefined) {
    window.webContents.send('setRoot', streamIndex, root);
    return;
  }
  root = resp['nextRoot'];
  window.webContents.send('setRoot', streamIndex, root);
}

// Callback used to pass data out of the fetch
const logData = p => {
  packet = JSON.parse(iota.utils.fromTrytes(p));
  window.webContents.send('fetchPacket', packet, streamIndex);
}

//#############################################
//##                 API LOGIC               ##
//#############################################

function getNodeInfo () {

  iota.api.getNodeInfo(function(err, result) {
    if (!err) {
      window.webContents.send('nodeInfo', result);
    }

  })

}
