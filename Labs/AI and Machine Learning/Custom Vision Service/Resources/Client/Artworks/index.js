const {app, BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')

let win

function createWindow() {
   win = new BrowserWindow({width: 540, height: 900})

   win.setMenu(null); // Remove default menu
   win.setIcon(path.join(__dirname, 'assets/icons/png/64x64.png'));
   win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
   }))
}

app.on('ready', createWindow)