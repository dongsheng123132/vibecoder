const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),

  // Command sending
  sendCommand: (data) => ipcRenderer.invoke('send-command', data),
  copyToClipboard: (text) => ipcRenderer.invoke('copy-to-clipboard', text),

  // Window detection
  getLastActiveWindow: () => ipcRenderer.invoke('get-last-active-window'),
  onActiveWindowChanged: (callback) => {
    const handler = (_, info) => callback(info);
    ipcRenderer.on('active-window-changed', handler);
    return () => ipcRenderer.removeListener('active-window-changed', handler);
  },

  // Persistent store
  storeGet: (key, defaultValue) => ipcRenderer.invoke('store-get', key, defaultValue),
  storeSet: (key, value) => ipcRenderer.invoke('store-set', key, value),
});
