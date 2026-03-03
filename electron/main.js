import { app, BrowserWindow, globalShortcut, ipcMain, Tray, Menu, nativeImage, clipboard } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import Store from 'electron-store';
import { detectActiveWindow } from './windowDetector.js';
import { sendToApp } from './inputSimulator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const store = new Store();
let mainWindow = null;
let tray = null;
let lastActiveWindow = null;
let windowDetectorInterval = null;

function createWindow() {
  const bounds = store.get('windowBounds', { width: 520, height: 700, x: undefined, y: undefined });

  mainWindow = new BrowserWindow({
    width: bounds.width,
    height: bounds.height,
    x: bounds.x,
    y: bounds.y,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    minimizable: true,
    skipTaskbar: false,
    hasShadow: true,
    vibrancy: 'dark',
    roundedCorners: true,
    minWidth: 380,
    minHeight: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('moved', () => saveWindowBounds());
  mainWindow.on('resized', () => saveWindowBounds());

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Start window detection
  startWindowDetection();
}

function saveWindowBounds() {
  if (!mainWindow) return;
  const bounds = mainWindow.getBounds();
  store.set('windowBounds', bounds);
}

function startWindowDetection() {
  windowDetectorInterval = setInterval(async () => {
    try {
      const info = await detectActiveWindow();
      if (info && info.app !== 'Electron' && info.app !== 'VibeCoder') {
        lastActiveWindow = info;
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('active-window-changed', info);
        }
      }
    } catch (e) {
      // silently ignore detection errors
    }
  }, 1000);
}

function createTray() {
  // Create a simple 16x16 tray icon
  const icon = nativeImage.createFromBuffer(
    Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABqSURBVDiNY/z//z8DEwMDAwMjIyMDEzYFjIyMDP///2dgZGRk+P8fVTETNsX///9nYGJi+s/ExPT/379/DEzYXMDIyMjw798/BiYGBgYGJiYmBkZsLmBkZGT49+8fAxMTEwMTExMDIzYXAAAGpBVdnVb0bAAAAABJRU5ErkJggg==',
      'base64'
    )
  );

  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    { label: '显示 VibeCoder', click: () => toggleWindow() },
    { type: 'separator' },
    { label: '退出', click: () => app.quit() },
  ]);
  tray.setToolTip('VibeCoder Keyboard');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => toggleWindow());
}

function toggleWindow() {
  if (!mainWindow) {
    createWindow();
    return;
  }
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    mainWindow.show();
    mainWindow.focus();
  }
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  // Global hotkey: Cmd+Shift+K
  globalShortcut.register('CommandOrControl+Shift+K', () => {
    toggleWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (!mainWindow) createWindow();
  else mainWindow.show();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  if (windowDetectorInterval) clearInterval(windowDetectorInterval);
});

// ─── IPC Handlers ───

ipcMain.handle('minimize-window', () => {
  mainWindow?.minimize();
});

ipcMain.handle('close-window', () => {
  mainWindow?.hide();
});

ipcMain.handle('send-command', async (_, { text, tool, recipe }) => {
  try {
    // Copy text to clipboard
    clipboard.writeText(text);
    // Send to the target app
    await sendToApp(text, tool, recipe, lastActiveWindow);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('get-last-active-window', () => {
  return lastActiveWindow;
});

ipcMain.handle('store-get', (_, key, defaultValue) => {
  return store.get(key, defaultValue);
});

ipcMain.handle('store-set', (_, key, value) => {
  store.set(key, value);
});

ipcMain.handle('copy-to-clipboard', (_, text) => {
  clipboard.writeText(text);
  return true;
});
