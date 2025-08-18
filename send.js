// send.js - Simple local chat app demo for 'Send'
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

// --- Multi-user support using localStorage ---
let messages = JSON.parse(localStorage.getItem('send-messages') || '[]');
let me = 'me';
let them = 'them';

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

function saveMessages() {
    localStorage.setItem('send-messages', JSON.stringify(messages));
}

// User management
let username = '';

function askUsername() {
    username = prompt('Enter your username:');
    if (!username || !username.trim()) {
        username = 'User' + Math.floor(Math.random() * 1000);
    }
    document.getElementById('chat-header').innerHTML = `<span id="logo" style="vertical-align:middle; margin-right:10px; font-size:1.3em; color:#ff9800;">📬</span>Send - <span style="color:#ff9800">${username}</span>`;
}

askUsername();

chatForm.onsubmit = function(e) {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    messages.push({ sender: username, text });
    saveMessages();
    renderMessages();
    chatInput.value = '';
};

// Listen for changes from other tabs (simulate multi-user on same device)
window.addEventListener('storage', function(e) {
    if (e.key === 'send-messages') {
        messages = JSON.parse(localStorage.getItem('send-messages') || '[]');
        renderMessages();
    }
});

renderMessages();
