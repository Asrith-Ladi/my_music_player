const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  win.loadURL('http://localhost:3000'); // during dev
}

app.on('ready', createWindow);

// Create download folder
const downloadDir = path.join(app.getPath('music'), 'AsrithPlayer');
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}

// Save file handler
ipcMain.handle('save-song', async (event, { filename, dataBuffer }) => {
  const filePath = path.join(downloadDir, filename);
  fs.writeFileSync(filePath, Buffer.from(dataBuffer));
  return filePath;
});
