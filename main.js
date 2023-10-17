import WebSocketHandler from './websocketHandler.js';

let chatWebSocket;

document.getElementById('send-button').addEventListener('click', () => {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    if (message) {
        chatWebSocket.sendMessage(message);
        // Might also want to display the sent message in your chat window here
        displaySentMessage(message);
        chatInput.value = ''; // Clear the input field
    }
});

function displaySentMessage(message) {
    const chatWindow = document.getElementById('chat-window');
    const messageElement = document.createElement('div');
    messageElement.classList.add('sent-message'); // Assuming there is a CSS class for styling sent messages
    messageElement.textContent = message;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto scroll to the bottom
}

function displayReceivedMessage(message) {
    const chatWindow = document.getElementById('chat-window');
    const messageElement = document.createElement('div');
    messageElement.classList.add('received-message'); // Assuming there is e a CSS class for styling received messages
    messageElement.textContent = message;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto scroll to the bottom
}

// Connect to WebSocket when the configuration is loaded
async function initializeWebSocket(endpoint, deploymentId) {
    chatWebSocket = new WebSocketHandler(endpoint, deploymentId);
    chatWebSocket.connect();

    // TODO: Extend the WebSocketHandler class to handle incoming messages and call displayReceivedMessage
    // For example, modify the onmessage handler in WebSocketHandler to trigger an event or callback.
}

// Listen to the custom event to initialize the WebSocket connection
document.addEventListener('configLoaded', (e) => {
    const { GCWSSEndpoint, GCMessagingDeplId } = e.detail;
    initializeWebSocket(GCWSSEndpoint, GCMessagingDeplId);
});
