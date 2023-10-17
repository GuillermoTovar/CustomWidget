import WebSocketHandler from './websocketHandler.js';

let chatWebSocket;

document.getElementById('send-button').addEventListener('click', () => {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    if (message) {
        chatWebSocket.sendMessage(message);
        displaySentMessage(message);
        chatInput.value = '';
    }
});

function displaySentMessage(message) {
    const chatWindow = document.getElementById('chat-window');
    const messageElement = document.createElement('div');
    messageElement.classList.add('sent-message');
    messageElement.textContent = message;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function displayReceivedMessage(message) {
    const chatWindow = document.getElementById('chat-window');
    const messageElement = document.createElement('div');
    messageElement.classList.add('received-message');
    messageElement.textContent = message;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function displayErrorMessage(message) {
    const chatWindow = document.getElementById('chat-window');
    const messageElement = document.createElement('div');
    messageElement.classList.add('error-message');
    messageElement.textContent = message;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function initializeWebSocket(endpoint, deploymentId) {
    chatWebSocket = new WebSocketHandler(endpoint, deploymentId);
    chatWebSocket.connect();
}

document.addEventListener('configLoaded', (e) => {
    const { GCWSSEndpoint, GCMessagingDeplId } = e.detail;
    initializeWebSocket(GCWSSEndpoint, GCMessagingDeplId);
    fetchMessageHistory().then(messages => {
        messages.forEach(message => {
            if (message.direction === "Outbound") {
                displaySentMessage(message.text);
            } else {
                displayReceivedMessage(message.text);
            }
        });
    });
});

document.addEventListener('errorMessage', (e) => {
    displayErrorMessage(e.detail);
});

async function fetchMessageHistory() {
    // This is a mock. Replace with actual fetch to your API.
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: "750fabf734de0ebbd6a53458cbd7848c",
                    type: "Text",
                    text: "Hello, how may I help you?",
                    direction: "Outbound"
                },
                {
                    id: "871ef990-686a-4ebc-a5b8-17a17cf8dbf8",
                    type: "Text",
                    text: "Good morning.",
                    direction: "Inbound"
                }
            ]);
        }, 1000);
    });
}
