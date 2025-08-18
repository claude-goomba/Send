// send.js - Simple local chat app demo for 'Send'
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

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

// --- Multi-user support using localStorage ---
let messages = JSON.parse(localStorage.getItem('send-messages') || '[]');

function renderMessages() {
    chatMessages.innerHTML = '';
    for (const msg of messages) {
        const div = document.createElement('div');
        const isMe = msg.sender === username;
        div.className = 'msg' + (isMe ? ' me' : ' them');
        // Colorful bubbles: alternate colors for different users
        let bubbleColor = isMe ? '#ff9800' : stringToColor(msg.sender);
        div.innerHTML = `<span class="bubble" style="background:${bubbleColor};color:#fff;"><b>${msg.sender}:</b> ${msg.text}</span>`;
        chatMessages.appendChild(div);
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function stringToColor(str) {
    // Generate a pastel color from a string
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 70%, 55%)`;
}

function saveMessages() {
    localStorage.setItem('send-messages', JSON.stringify(messages));
}

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
