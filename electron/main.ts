
import { app, BrowserWindow, nativeImage } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'PalCentral',
    icon: path.join(__dirname, "src/assets/icon.ico"),
    webPreferences: {
      webSecurity: false, 
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  if (process.platform === 'darwin') {
    const imagePath = path.join(__dirname, 'src/assets/icon.png'); 
    const image = nativeImage.createFromPath(imagePath);
    
    if (!image.isEmpty()) {
      app?.dock?.setIcon(image);
    }
  }

  createWindow();
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});