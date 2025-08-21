# Combined HTTP and WebSocket server for Send Chat App
import asyncio
import json
import os
from aiohttp import web
import mimetypes

PORT = 8000
messages = []
clients = set()

# WebSocket handler
async def websocket_handler(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)
    clients.add(ws)
    try:
        await ws.send_json({"type": "messages", "messages": messages})
        async for msg in ws:
            if msg.type == web.WSMsgType.TEXT:
                data = json.loads(msg.data)
                if data.get("type") == "message":
                    message = {"sender": data["sender"], "text": data["text"]}
                    messages.append(message)
                    # Broadcast to all
                    for client in clients:
                        await client.send_json({"type": "message", "message": message})
            elif msg.type == web.WSMsgType.ERROR:
                print(f'WebSocket connection closed with exception {ws.exception()}')
    finally:
        clients.remove(ws)
    return ws

# Serve static files from current directory
def setup_static_routes(app):
    static_dir = os.path.dirname(os.path.abspath(__file__))
    app.router.add_static('/', static_dir, show_index=True)

# Serve index.html on root
async def index(request):
    return web.FileResponse('index.html')

app = web.Application()
app.router.add_get('/', index)
app.router.add_get('/ws', websocket_handler)
setup_static_routes(app)

if __name__ == "__main__":
    print(f"Server running on http://localhost:{PORT}/ (WebSocket at ws://localhost:{PORT}/ws)")
    web.run_app(app, port=PORT)
