from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

# In-memory chat storage (for demo only, not persistent)
chats = {}

@app.route('/api/chats', methods=['GET'])
def get_chats():
    return jsonify(list(chats.keys()))

@app.route('/api/chats/<chat_id>', methods=['GET'])
def get_chat(chat_id):
    return jsonify(chats.get(chat_id, []))

@app.route('/api/chats/<chat_id>', methods=['POST'])
def post_message(chat_id):
    data = request.json
    msg = {
        'sender': data.get('sender', 'unknown'),
        'text': data.get('text', ''),
        'time': data.get('time', time.strftime('%H:%M'))
    }
    if chat_id not in chats:
        chats[chat_id] = []
    chats[chat_id].append(msg)
    return jsonify({'ok': True, 'msg': msg})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
