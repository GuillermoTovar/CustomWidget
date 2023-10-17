import WebSocketHandler from './websocketHandler.js';

let wsHandler = null;

// Initialize WebSocket handler and set up chat events
async function initializeChat() {
    const config = await getConfig();
    const GCMessagingDeplId = config.GCMessagingDeplId;
    const GCWSSEndpoint = config.GCWSSEndpoint;

    wsHandler = new WebSocketHandler(GCMessagingDeplId, GCWSSEndpoint);
    wsHandler.connect();

    document.getElementById('send-button').addEventListener('click', sendMessageToServer);
}

// Send user's message to the server
function sendMessageToServer() {
    const inputElem = document.getElementById('chat-input');
    const message = inputElem.value;

    if (message.trim() !== '') {
        wsHandler.sendMessage(message);
        displayMessage('You', message);
        inputElem.value = '';  // Clear the input field
    }
}

// Display messages in the chat window
function displayMessage(sender, message) {
    const chatWindow = document.getElementById('chat-window');
    const messageElem = document.createElement('div');
    messageElem.classList.add('chat-message');
    messageElem.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatWindow.appendChild(messageElem);
}

// Fetch configuration from server
async function getConfig() {
    try {
        const response = await fetch('/api/getConfig');
        if (!response.ok) {
            throw new Error('Environment vars could not be retrieved');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

initializeChat();
