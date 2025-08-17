const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveSong: (filename, dataBuffer) => ipcRenderer.invoke('save-song', { filename, dataBuffer })
});
