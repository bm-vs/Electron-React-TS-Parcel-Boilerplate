import {BrowserWindow, App, app} from 'electron'
import isDev from 'electron-is-dev'

if (isDev) {
	require('electron-reload')(`${__dirname}/..`, {
		electron: require(`${__dirname}/../../node_modules/electron`)
	})
}

class Main {
	static mainWindow: BrowserWindow | null;
	static app: App;

	private static createWindow() {
		Main.mainWindow = new BrowserWindow({height: 800, width: 800})
		Main.mainWindow.loadURL(
			isDev ?
				'http://localhost:1234' :
				`file://${__dirname}/../../dist-renderer/index.html`
		)
		if (isDev) {
			Main.mainWindow.webContents.openDevTools()
		}
		Main.mainWindow.on('closed', Main.onClose)
	}

	private static onClose() {
		Main.mainWindow = null
	}

	private static onWindowActivate() {
		if (BrowserWindow.getAllWindows().length === 0) {
			Main.createWindow()
		}
	}

	private static onWindowAllClosed() {
		if (process.platform !== 'darwin') {
			app.quit()
		}
	}

	static main(electronApp: App) {
		Main.app = electronApp
		Main.app.on('ready', Main.createWindow)
		Main.app.on('activate', Main.onWindowActivate)
		Main.app.on('window-all-closed', Main.onWindowAllClosed)

	}
}

Main.main(app)