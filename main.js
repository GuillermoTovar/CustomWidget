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

async getJWT() {
    const messagePayload = {
        action: "getJwt",
        token: this.token
    };
    const response = await this.sendMessageWithResponse(messagePayload);
    return response.jwt;
}

async fetchMessageHistory(jwt, domain, pageSize = 10, pageNumber = 1) {
    const apiUrl = `/api/v2/webmessaging/messages?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${jwt}`);
    headers.append("Origin", domain);
    
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: headers
    });

    if (!response.ok) {
        throw new Error('Failed to fetch message history');
    }
    return await response.json();
}
