# Send Chat App PWA

This is a modern, installable chat app with emoji, camera/photo upload, and offline support. 

## Features
- Emoji sidebar
- Camera/photo upload
- Offline support (PWA)
- Installable on mobile and desktop
- Service worker caching
- PWA install banner
- Real-time chat backend (WebSocket server)
- Cross-device chat sync

## Usage
- Open http://localhost:8000 for main app
- Add to home screen when prompted for the best experience.

## Development
- Edit `index.html` and `sendmobile.js` for the mobile UI.
- Service worker and manifest are in the same folder.

## Python Environment Setup

This project uses a [uv](https://github.com/astral-sh/uv) virtual environment for Python dependencies.

### Setup Instructions

1. **Create and activate the environment:**
   ```bash
   uv venv .venv
   source .venv/bin/activate
   ```
2. **Install dependencies:**
   ```bash
   uv pip install -r requirements.txt
   ```

### Running the Server

To start the app, run:

```bash
python server.py
```

- This serves all static files (HTML, JS, CSS, etc.) and provides the WebSocket backend on `/ws`.
- Open http://localhost:8000/ in your browser.

Press Ctrl+C to stop the server.

## To Do
- Add push notifications
- Polish UI/UX
