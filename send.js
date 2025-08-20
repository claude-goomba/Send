// send.js - Simple local chat app demo for 'Send'
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

// --- Multi-user support using localStorage ---
let messages = [];
let me = 'me';
let them = 'them';

// --- Chat switching logic ---
const chatList = [];
let currentChatId = null;

function getStorageKey(chatId) {
    return `send-messages-${chatId}`;
}

function loadMessages(chatId) {
    messages = JSON.parse(localStorage.getItem(getStorageKey(chatId)) || '[]');
    renderMessages();
}

function saveMessages() {
    if (currentChatId) {
        localStorage.setItem(getStorageKey(currentChatId), JSON.stringify(messages));
    }
}

function renderChatTabs() {
    let tabs = document.getElementById('chat-tabs');
    if (!tabs) {
        tabs = document.createElement('div');
        tabs.id = 'chat-tabs';
        tabs.style.display = 'flex';
        tabs.style.gap = '8px';
        tabs.style.justifyContent = 'center';
        tabs.style.margin = '0 0 12px 0';
        document.getElementById('chat-header').prepend(tabs);
    }
    tabs.innerHTML = '';
    if (chatList.length === 0) {
        const msg = document.createElement('div');
        msg.textContent = 'Start by adding a new chat!';
        msg.style.color = '#fff';
        msg.style.fontWeight = 'bold';
        msg.style.fontSize = '1.1em';
        msg.style.margin = '0 12px 0 0';
        tabs.appendChild(msg);
    }
    chatList.forEach((chat, idx) => {
        const btn = document.createElement('button');
        btn.textContent = chat.name;
        btn.style.padding = '8px 18px';
        btn.style.borderRadius = '8px';
        btn.style.border = 'none';
        btn.style.background = chat.id === currentChatId ? '#fff' : '#009688';
        btn.style.color = chat.id === currentChatId ? '#009688' : '#fff';
        btn.style.fontWeight = 'bold';
        btn.style.cursor = 'pointer';
        btn.onclick = () => {
            if (currentChatId !== chat.id) {
                saveMessages();
                currentChatId = chat.id;
                loadMessages(currentChatId);
                renderChatTabs();
            }
        };
        // Add rename icon
        const rename = document.createElement('span');
        rename.textContent = ' ✏️';
        rename.style.cursor = 'pointer';
        rename.style.marginLeft = '6px';
        rename.title = 'Rename chat';
        rename.onclick = (e) => {
            e.stopPropagation();
            const newName = prompt('Enter new chat name:', chat.name);
            if (newName && newName.trim()) {
                chat.name = newName.trim();
                renderChatTabs();
            }
        };
        btn.appendChild(rename);
        // Add delete icon (if more than 1 chat)
        if (chatList.length > 1) {
            const del = document.createElement('span');
            del.textContent = ' ❌';
            del.style.cursor = 'pointer';
            del.style.marginLeft = '4px';
            del.title = 'Delete chat';
            del.onclick = (e) => {
                e.stopPropagation();
                if (confirm(`Delete chat '${chat.name}'?`)) {
                    localStorage.removeItem(getStorageKey(chat.id));
                    chatList.splice(idx, 1);
                    if (currentChatId === chat.id) {
                        currentChatId = chatList.length ? chatList[0].id : null;
                        if (currentChatId) loadMessages(currentChatId);
                        else {
                            messages = [];
                            renderMessages();
                        }
                    }
                    renderChatTabs();
                }
            };
            btn.appendChild(del);
        }
        // Add 'Add User' button
        const addUser = document.createElement('span');
        addUser.textContent = ' ➕';
        addUser.style.cursor = 'pointer';
        addUser.style.marginLeft = '4px';
        addUser.title = 'Add user to this chat by phone number';
        addUser.onclick = (e) => {
            e.stopPropagation();
            let phone = '';
            while (!phone) {
                phone = prompt('Enter phone number to add (required):');
                if (!phone || !phone.trim()) {
                    alert('Phone number is required!');
                    phone = '';
                } else {
                    phone = phone.replace(/[^\d+]/g, '');
                    if (!phone) {
                        alert('Phone number must contain digits or +.');
                    }
                }
            }
            // Append phone to chat name if not already present
            if (!chat.name.includes(phone)) {
                chat.name += ` (${phone})`;
                renderChatTabs();
            } else {
                alert('This phone number is already in the chat name.');
            }
        };
        btn.appendChild(addUser);
        tabs.appendChild(btn);
    });
    // Add "New Chat" button for new chat
    const addBtn = document.createElement('button');
    addBtn.textContent = 'New Chat';
    addBtn.title = 'Add new chat';
    addBtn.style.padding = '8px 18px';
    addBtn.style.borderRadius = '8px';
    addBtn.style.border = 'none';
    addBtn.style.background = '#009688';
    addBtn.style.color = '#fff';
    addBtn.style.fontWeight = 'bold';
    addBtn.style.cursor = 'pointer';
    addBtn.onclick = () => {
        let name = prompt('Enter new chat name:');
        if (!name || !name.trim()) return;
        name = name.trim();
        let phone = '';
        while (!phone) {
            phone = prompt('Enter phone number for this chat (required):');
            if (!phone || !phone.trim()) {
                alert('Phone number is required!');
                phone = '';
            } else {
                phone = phone.replace(/[^\d+]/g, ''); // keep only digits and plus
                if (!phone) {
                    alert('Phone number must contain digits or +.');
                }
            }
        }
        name += ` (${phone})`;
        let baseId = name.toLowerCase().replace(/\s+/g, '');
        let id = baseId;
        let n = 2;
        while (chatList.some(c => c.id === id)) {
            id = baseId + n;
            n++;
        }
        chatList.push({ id, name });
        saveMessages();
        currentChatId = id;
        loadMessages(currentChatId);
        renderChatTabs();
    };
    tabs.appendChild(addBtn);
}

// Patch renderMessages to use current chat
function renderMessages() {
    chatMessages.innerHTML = '';
    for (const msg of messages) {
        const div = document.createElement('div');
        div.className = 'msg' + (msg.sender === username ? 'me' : 'them');
        // Add time display
        const time = msg.time ? `<span class="msg-time" style="font-size:0.85em; color:#fff8; margin-left:8px;">${msg.time}</span>` : '';
        div.innerHTML = `<span class="bubble"><b>${msg.sender}:</b> ${msg.text}${time}</span>`;
        chatMessages.appendChild(div);
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
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
    // Add time to message
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messages.push({ sender: username, text, time });
    saveMessages();
    renderMessages();
    chatInput.value = '';
};

// Send message on Enter (without Shift)
chatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
    }
});

// On load, render tabs and load first chat (if any)
renderChatTabs();
if (chatList.length) {
    currentChatId = chatList[0].id;
    loadMessages(currentChatId);
}

// Listen for changes from other tabs (simulate multi-user on same device)
window.addEventListener('storage', function(e) {
    if (e.key === getStorageKey(currentChatId)) {
        messages = JSON.parse(localStorage.getItem(getStorageKey(currentChatId)) || '[]');
        renderMessages();
    }
});

// --- Update Screen Logic ---
function showUpdateScreen() {
    if (document.getElementById('update-screen')) return;
    const updateDiv = document.createElement('div');
    updateDiv.id = 'update-screen';
    updateDiv.innerHTML = `
        <h1>Update Available</h1>
        <p>A new version of Send is available.<br>Reload to update and get the latest features!</p>
        <button id="update-reload-btn">Reload Now</button>
    `;
    document.body.appendChild(updateDiv);
    document.getElementById('update-reload-btn').onclick = () => {
        location.reload();
    };
}
// Example: Listen for a fake update event (replace with real logic as needed)
window.addEventListener('send-update', showUpdateScreen);
// To test manually, run: window.dispatchEvent(new Event('send-update'));

// --- Loading Screen Logic ---
function showLoadingScreen() {
    if (document.getElementById('loading-screen')) return;
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-screen';
    loadingDiv.innerHTML = `
        <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
        <div style="margin-top:24px;font-size:1.2em;letter-spacing:1px;">Loading Send...</div>
    `;
    document.body.appendChild(loadingDiv);
}
function hideLoadingScreen() {
    const loadingDiv = document.getElementById('loading-screen');
    if (loadingDiv) loadingDiv.remove();
}
// Show loading screen on startup, hide after 1s
showLoadingScreen();
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(hideLoadingScreen, 1000);
});

// Auto-switch UI based on device, no redirect, just switch logic
window.addEventListener('DOMContentLoaded', () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        document.body.classList.add('mobile-ui');
        // Detect brand for color scheme
        let brand = 'turquoise';
        if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) brand = 'apple';
        else if (/Samsung/i.test(navigator.userAgent)) brand = 'samsung';
        else if (/Pixel|Google/i.test(navigator.userAgent)) brand = 'google';
        if (brand !== 'turquoise') document.body.classList.add(brand);
        // else just use default turquoise
    } else {
        document.body.classList.remove('mobile-ui', 'apple', 'samsung', 'google');
    }
});
