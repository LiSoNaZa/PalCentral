# PalCentral - a Palworld Admin Dashboard 🎮

A modern, fast, and responsive web dashboard to manage your Palworld Dedicated Server using the official REST API. Built with **SolidJS**, **TypeScript**, **Tailwind CSS** and **Electron**.

---

## ✨ Features

* **Secure Login:** Connect directly via IP, Port, and Admin Password (saved locally).
* **Live Metrics:** Real-time tracking of Server FPS, Frame Times, Uptime, and Player Count (5s auto-refresh).
* **Advanced Player List:** View online players with their Level, playerID, IP, Ping, and live In-Game Coordinates.
* **Moderation Tools:** Instantly **Kick** or **Ban** players directly from the UI.
* **Ban Management:** Revoke bans easily by entering the Player's UID/SteamID.
* **In-Game Broadcasts:** Send global announcement messages to all active players.
* **Dynamic Settings Search:** View and filter all 60+ server configuration variables instantly with a built-in search bar.
* **Clean Native UX:** Mac-style custom scrollbars (even on Windows) and sleek toast notifications.
* **Interactive Live Map:** A high-performance, real-time map displaying live exact player positions and provide a follor player function.

---

## 🗺️ Planned Features / Roadmap

* **🎮 Hybrid RCON Support:** Fallback and alternative connection method using RCON for servers where the REST API cannot be exposed.
* **🖥️ Multi-Server Management:** Easily switch between multiple saved Palworld servers from a sidebar without logging out and in again.
* **📍 Live Map extension:** Add various improvements and more POI to the live map.
* ~~**📍 Interactive Live Map:** A high-performance, real-time map displaying exact player positions.~~ (Umgesetzt in Version 1.1)

---

## 🚀 Tech Stack

* **Frontend:** SolidJS
* **Styling:** Tailwind CSS
* **Language:** TypeScript
* **Build Tool:** Vite
* **Desktop-Framework:** Electron (Transforms the web dashboard into a native cross-platform desktop application)
* **Map-Library:** Leaflet

---

## 🛠️ Prerequisites

You need to enable the **REST API** in your server's `PalWorldSettings.ini`:

[PalWorldSettings]
RESTAPIEnabled=True
RESTAPIPort=8212
AdminPassword="YourSecureAdminPassword"

> ⚠️ Make sure the port (default: `8212`) is opened in your firewall (TCP).

---

## 📦 Getting Started

### Instalation
Download one of the installer from the latest release.

### Development

#### 1. Clone the repository
git clone https://github.com/LiSoNaZa/PalCentral.git
cd PalCentral

#### 2. Install dependencies
npm install

#### 3. Run the development server
npm run dev

#### 4. Build for production
npm run build

---

## 🔒 Security Note

This is a **100% client-side application**. Your credentials are only stored in your browser's `localStorage` and sent directly to your own server's IP address. There is no third-party backend tracking or saving your passwords.

### ⚠️ Note for Windows Users (SmartScreen Warning)

Since **PalCentral** is an open-source project and the installer is not digitally signed with an expensive Microsoft developer certificate, Windows Defender might show a blue warning screen saying: *"Windows protected your PC"*.

This is completely normal for independent open-source software. To run the app:
1. Click on **"More info"** inside the blue windows popup.
2. Click the **"Run anyway"** button that appears.

*You can inspect the entire source code here on GitHub to verify that the application is 100% safe and only communicates directly with your own server.*

---

## 📄 License

This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)** License. 

You are free to:
* **Share:** Copy and redistribute the material in any medium or format.
* **Adapt:** Remix, transform, and build upon the material.

Under the following terms:
* **Attribution:** You must give appropriate credit and indicate if changes were made.
* **NonCommercial:** You may **not** use the material for commercial purposes.
* **ShareAlike:** If you remix, transform, or build upon the material, you must distribute your contributions under the **same license** as the original.

See the [LICENSE](LICENSE) file for the full legal text.