# Simple WebSocket server for Send Chat App
import asyncio
import websockets
import json

PORT = 8765
messages = []
clients = set()

async def handler(websocket):
    clients.add(websocket)
    try:
        # Send all previous messages to new client
        await websocket.send(json.dumps({"type": "messages", "messages": messages}))
        async for msg in websocket:
            data = json.loads(msg)
            if data.get("type") == "message":
                message = {"sender": data["sender"], "text": data["text"]}
                messages.append(message)
                # Broadcast to all
                for client in clients:
                    await client.send(json.dumps({"type": "message", "message": message}))
    except Exception:
        pass
    finally:
        clients.remove(websocket)

async def main():
    async with websockets.serve(handler, "0.0.0.0", PORT):
        print(f"WebSocket server running on ws://0.0.0.0:{PORT}")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
