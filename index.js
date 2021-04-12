// msPresence
// Created by Matko

const VER = require('./package.json').version;

const DiscordRPC = require('discord-rpc');
const { app, BrowserWindow, Notification } = require('electron');
const path = require('path');

const clientId = '831034192824762369';
// const scopes = ['rpc', 'rpc.api'];

const rpc = new DiscordRPC.Client({ transport: 'ipc' });

let browserWindow;

// Window
function createWindow() {
    browserWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    browserWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Notifications
function quickNotify(title, body) {
    const notification = new Notification({ title, body });
    notification.show();
}

// Activity
const dateNow = new Date();

async function setActivity(activity) {
    if (!rpc) return;

    await rpc.setActivity({
        details: activity.details,
        state: activity.state,
        startTimestamp: activity.showTimestamp ? dateNow : undefined,
        largeImageKey: 'snek_large',
        largeImageText: activity.largeImageText,
        smallImageKey: 'snek_small',
        smallImageText: activity.smallImageText,
        instance: false
    });
}

// Discord RPC
DiscordRPC.register(clientId);

console.log(`Notifications supported: ${Notification.isSupported()}`)

rpc.on('ready', async () => {
    console.log('MS-Presence is starting on version ' + VER + '.');
    quickNotify('MS-Presence', 'Attempting to connect through IPC.');

    await setActivity({
        details: 'Testing MS-Presence',
        state: 'Currently developing RPC',
    });

    quickNotify('MS-Presence', 'Connected to RPC through IPC.');
});

rpc.login({ clientId }).catch((exception) => {
    quickNotify('MS-Presence', 'RPC failed to connect.');
    console.error(exception);
});
