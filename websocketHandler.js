class WebSocketHandler {
    constructor(endpoint, deploymentId) {
        this.endpoint = endpoint;
        this.deploymentId = deploymentId;
        this.token = this._generateUUID();
        this.socket = null;
    }

    connect() {
        this.socket = new WebSocket(`${this.endpoint}?deploymentId=${this.deploymentId}`);
        
        this.socket.onopen = (event) => {
            this._configureSession();
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "response" && data.code !== 200) {
                this._handleError(data);
            }
            // TODO: Handle other incoming messages and update UI
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
            // TODO: Handle errors, maybe retry connecting after some time
        };

        this.socket.onclose = (event) => {
            if (event.wasClean) {
                console.log(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
            } else {
                console.error('Connection died');
            }
        };

        setInterval(() => {
            this._sendEcho();
        }, 60000); // Send echo every 60 seconds
    }

    _handleError(data) {
        let errorMessage;
        switch (data.code) {
            case 400:
                errorMessage = "Bad request. Please check the data you're sending.";
                break;
            case 403:
                errorMessage = "Forbidden. Please check feature toggle or configuration.";
                break;
            case 404:
                errorMessage = "Object not found. Please provide valid ID.";
                break;
            // ... (handle other error codes similarly)
            default:
                errorMessage = data.body; // Default to the error message from the server
        }
        const errorEvent = new CustomEvent('errorMessage', { detail: errorMessage });
        document.dispatchEvent(errorEvent);
    }

    _configureSession() {
        const configMessage = {
            action: "configureSession",
            deploymentId: this.deploymentId,
            token: this.token
        };
        this.socket.send(JSON.stringify(configMessage));
    }

    sendMessage(message) {
        const messagePayload = {
            action: "onMessage",
            token: this.token,
            message: {
                type: "Text",
                text: message
            }
        };
        this.socket.send(JSON.stringify(messagePayload));
    }

    _sendEcho() {
        const echoPayload = {
            action: "echo",
            message: {
                type: "Text",
                text: "ping"
            }
        };
        this.socket.send(JSON.stringify(echoPayload));
    }

    _generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

export default WebSocketHandler;
