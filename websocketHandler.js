class WebSocketHandler {
    constructor(deploymentId) {
        this.endpoint = process.env.GCWSSEndpoint || 'wss://webmessaging.mypurecloud.com/v1';
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
            // TODO: Handle incoming messages and update UI
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

    _generateUUID() {
        // Simple function to generate a UUID
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

export default WebSocketHandler;
