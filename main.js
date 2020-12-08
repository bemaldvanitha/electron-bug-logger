const path = require('path');
const url = require('url');
const { app, BrowserWindow,ipcMain,Menu } = require('electron');
const mongoose = require('mongoose');

const Logs = require('./models/log');

const isMac = process.env.platform === 'darwin' ? true : false;

mongoose.connect('mongodb://localhost/buglogger',{useNewUrlParser: true});
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error',(err) => {
	console.log(err);
});
db.once('open',() => {
	console.log('connected');
});

let mainWindow;

let isDev = false;

if (
	process.env.NODE_ENV !== undefined &&
	process.env.NODE_ENV === 'development'
) {
	isDev = true
}

function createMainWindow() {
	mainWindow = new BrowserWindow({
		width: 1100,
		height: 800,
		show: false,
		backgroundColor: 'white',
		icon: './assets/icons/icon.png',
		webPreferences: {
			nodeIntegration: true,
		},
	});

	let indexPath;

	if (isDev && process.argv.indexOf('--noDevServer') === -1) {
		indexPath = url.format({
			protocol: 'http:',
			host: 'localhost:8080',
			pathname: 'index.html',
			slashes: true,
		})
	} else {
		indexPath = url.format({
			protocol: 'file:',
			pathname: path.join(__dirname, 'dist', 'index.html'),
			slashes: true,
		})
	}

	mainWindow.loadURL(indexPath);

	// Don't show until we are ready and loaded
	mainWindow.once('ready-to-show', () => {
		mainWindow.show();

		const mainMenu = Menu.buildFromTemplate(menu);
		Menu.setApplicationMenu(mainMenu);
	});

	mainWindow.on('closed', () => (mainWindow = null))
}

app.on('ready', createMainWindow);

ipcMain.on('logs:load',sendLogs);

const menu = [
	...(isMac ? [
		{role: 'appMenu'}
	]: []),
	{
		label: 'File',
		submenu: [
			{
				label: 'Quit',
				accelerator: isMac ? 'Command+Q' : 'Ctrl+Q',
				click: () =>app.quit()
			}
		]
	},
	...(isDev ? [
		{
			label: 'Developer',
			submenu: [
				{role:'reload'},
				{role:'forcereload'},
				{role:'toggledevtools'},
			]
		}
	]: [])
];

function sendLogs ()  {
	Logs.find({}).then((logs)=> {
		mainWindow.webContents.send('logs:get',JSON.stringify(logs))
	}).catch((err) => {
		console.log(err);
	});
}

ipcMain.on('logs:add',(e,logs) => {
	Logs.create(JSON.parse(logs)).then((data) => {
		console.log(data);
		Logs.find({}).then(logs => {
			mainWindow.webContents.send('logs:added',JSON.stringify(logs))
		});
	});
});

ipcMain.on('logs:delete',(e,id) => {
	console.log(id);
	Logs.findByIdAndRemove({_id:id}).then(data => {
		Logs.find({}).then(logs => {
			mainWindow.webContents.send('logs:deleted',JSON.stringify(logs))
		});
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createMainWindow()
	}
});

// Stop error
app.allowRendererProcessReuse = true;
