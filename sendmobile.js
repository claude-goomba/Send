// send.js - Simple local chat app demo for 'Send'
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

// --- Realtime multi-user support using WebSocket ---
let ws;
let messages = [];
let username = '';

function connectWS() {
    ws = new WebSocket('ws://' + location.hostname + ':8765');
    ws.onopen = () => {
        ws.send(JSON.stringify({ type: 'join', user: username }));
    };
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'messages') {
            messages = data.messages;
            renderMessages();
        } else if (data.type === 'message') {
            messages.push(data.message);
            renderMessages();
        }
    };
    ws.onclose = () => {
        setTimeout(connectWS, 2000); // retry
    };
}

function renderMessages() {
    chatMessages.innerHTML = '';
    for (const msg of messages) {
        const div = document.createElement('div');
        div.className = 'msg' + (msg.sender === username ? ' me' : ' them');
        div.innerHTML = `<span class="bubble"><b>${msg.sender}:</b> ${msg.text}</span>`;
        chatMessages.appendChild(div);
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function askUsername() {
    username = prompt('Enter your username:');
    if (!username || !username.trim()) {
        username = 'User' + Math.floor(Math.random() * 1000);
    }
    document.getElementById('chat-header').innerHTML = `<span id="logo" style="vertical-align:middle; margin-right:10px; font-size:1.3em; color:#ff9800;">📬</span>Send - <span style="color:#ff9800">${username}</span>`;
}

askUsername();
connectWS();

chatForm.onsubmit = function(e) {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    ws.send(JSON.stringify({ type: 'message', sender: username, text }));
    chatInput.value = '';
};

// Send message on Enter (without Shift)
chatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
    }
});
