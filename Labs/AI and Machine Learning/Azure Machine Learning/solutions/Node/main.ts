
const {app, BrowserWindow} = require('electron');

let win = null;

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

function createWindow() {

    win = new BrowserWindow({width: 800, height: 600});
    win.loadURL(`file://${__dirname}/index.html`);
    win.on('closed', () => {
        win = null
    });

    //win.webContents.openDevTools();
}
