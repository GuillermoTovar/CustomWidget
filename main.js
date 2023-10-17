let chatWebSocket;

document.getElementById('send-button').addEventListener('click', () => {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    if (message) {
        chatWebSocket.sendMessage(message);
        displaySentMessage(message);
        chatInput.value = ''; // Clear the input field
    }
});

function displaySentMessage(message) {
    const chatWindow = document.getElementById('chat-window');
    const messageElement = document.createElement('div');
    messageElement.classList.add('sent-message');
    messageElement.textContent = message;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto scroll to the bottom
}

function displayReceivedMessage(message) {
    const chatWindow = document.getElementById('chat-window');
    const messageElement = document.createElement('div');
    messageElement.classList.add('received-message');
    messageElement.textContent = message;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Auto scroll to the bottom
}

// Connect to WebSocket when the configuration is loaded
function initializeWebSocket(endpoint, deploymentId) {
    chatWebSocket = new WebSocketHandler(endpoint, deploymentId, displayReceivedMessage);
    chatWebSocket.connect();
}

// Listen to the custom event to initialize the WebSocket connection
document.addEventListener('configLoaded', (e) => {
    const { GCWSSEndpoint, GCMessagingDeplId } = e.detail;
    initializeWebSocket(GCWSSEndpoint, GCMessagingDeplId);
});

// To load message history on start, finish the code regarding this part in websocketHandler.js and uncomment below:
/*


async function loadMessageHistory() {
    try {
        const jwt = await chatWebSocket.getJWT();
        const messageHistory = await chatWebSocket.fetchMessageHistory(jwt, window.location.origin);
        displayMessageHistory(messageHistory.entities);
    } catch (error) {
        console.error('Failed to load message history:', error);
    }
}

function displayMessageHistory(messages) {
    messages.forEach(message => {
        if (message.direction === "Outbound") {
            displaySentMessage(message.text);
        } else {
            displayReceivedMessage(message.text);
        }
    });
}

// Call this function after the WebSocket is connected and the chat UI is initialized
// loadMessageHistory();

*/
