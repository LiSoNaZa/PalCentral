# Changelog

All notable changes to the **PalCentral** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.1] - 2026-07-14

### Fixed
* **Player List Parsing:** Fixed an issue where the online player list failed to display due to response structure mismatch from the Palworld REST API.
* **Responsive Layout:** Fixed various UI overlapping and alignment bugs on smaller screen resolutions and resized windows.

---

## [1.0.0] - 2026-07-10

### Added
* **Secure Login:** Connect directly via IP, Port, and Admin Password with credentials safely stored in local application storage.
* **Live Metrics:** Real-time tracking of Server FPS, Frame Times, Uptime, and Player Count with automatic 5-second polling cycles.
* **Advanced Player List:** Detailed view of active players displaying their Level, Player ID, IP Address, Ping, and live In-Game Coordinates.
* **Moderation Tools:** One-click **Kick** and **Ban** functionality directly from the player table.
* **Ban Management:** Dedicated section to revoke bans effortlessly by providing the Player's UID or SteamID.
* **In-Game Broadcasts:** Ability to send global announcement messages to all online players in real time.
* **Dynamic Settings Search:** Instant search and filtering capability for all 60+ server configuration variables (`PalWorldSettings.ini`).
* **Clean Native UX:** Customized macOS-style scrollbars (styled across all platforms including Windows) paired with a responsive toast notification system.