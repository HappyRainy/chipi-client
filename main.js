const { app, ipcMain, globalShortcut } = require('electron');
const { createWindow, hideWindow, toggleWindow } = require('./main/window');
const { createMenu } = require('./main/menu');
const { registerScheme, registerBufferProtocol } = require('./main/protocol');

let mainWindow;

if (process.env.NODE_ENV === 'development') {
    require('electron-reload')(__dirname);
}

registerScheme();

app.on('ready', () => {
    const settings = require('./main/settings');

    registerBufferProtocol();

    mainWindow = createWindow();

    settings.watch('globalShortcut', (newValue, oldValue) => {
        if (oldValue) {
            globalShortcut.unregister(oldValue);
        }

        globalShortcut.register(newValue, () => toggleWindow(mainWindow));
    });

    globalShortcut.register(settings.get('globalShortcut'), () => toggleWindow(mainWindow));

    createMenu(mainWindow);

    app.on('browser-window-blur', (event, win) => {
        if (win === mainWindow && settings.get('hideOnBlur')) {
            hideWindow(mainWindow);
        }
    });

    ipcMain.on('hide-window', () => {
        if (settings.get('hideOnBlur')) {
            hideWindow(mainWindow);
        }
    });
});

app.on('will-quit', () => globalShortcut.unregisterAll());

app.on('activate', () => {
    if (mainWindow === null) {
        mainWindow = createWindow();
    }
});
