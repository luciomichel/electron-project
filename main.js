const {app, BrowserWindow, dialog} = require('electron')
const path = require('path')
const {autoUpdater} = require('electron-updater')
const log = require('electron-log')
const os = require("os");
log.transports.file.resolvePath = () => path.join(os.homedir(), 'auto-update-electron.log')
log.info('Versão da aplicação = ' + app.getVersion())
let win;

function createWindow() {
    win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
    });
    win.loadFile(path.join(__dirname, 'index.html'))
}

autoUpdater.autoDownload = true;

app.on('ready', () => {
    createWindow();
    autoUpdater.checkForUpdates().then(function (r) {
        return log.info('finalizou check update');
    })
})

app.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
    log.info('update-available')
    //autoUpdater.downloadUpdate()
})

autoUpdater.on('update-not-available', () => {
    log.info('update-not-available')
})

autoUpdater.on('checking-for-update', () => {
    log.info('checking-for-update')
})

autoUpdater.on('download-progress', (progressTrack) => {
    log.info('\n\ndownload-progress')
    log.info(progressTrack)
})

autoUpdater.on('update-downloaded', () => {
    log.info('update-downloaded')
    dialog.showMessageBox({
        type: 'info',
        title: 'Nova versão baixada',
        message: 'Deseja instalar agora??',
        buttons: ['Sim', 'Não']
    }).then(result => {
        let buttonIndex = result.response
        if (buttonIndex === 0) autoUpdater.quitAndInstall(false, true)
    });
})

autoUpdater.on('appimage-filename-updated', () => {
    log.info('appimage-filename-updated')
})

autoUpdater.on('update-cancelled', () => {
    log.info('update-cancelled')
})

autoUpdater.on('error', (e) => {
    log.info('Erro no auto-update ' + e)
    console.log(e);
})