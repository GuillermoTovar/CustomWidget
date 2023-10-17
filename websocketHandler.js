class WebSocketHandler {
    constructor(endpoint, deploymentId, messageCallback) {
        this.endpoint = endpoint;
        this.deploymentId = deploymentId;
        this.token = this._generateUUID();
        this.socket = null;
        this.messageCallback = messageCallback; // Store the callback
    }

    connect() {
        const fullEndpoint = this.endpoint.startsWith('wss://') ? this.endpoint : `wss://${this.endpoint}`;
        this.socket = new WebSocket(`${fullEndpoint}?deploymentId=${this.deploymentId}`);
        
        this.socket.onopen = (event) => {
            this._configureSession();
        };
        
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received message:", data); // Debug log
            if (data.type && data.type === "Text" && data.direction && data.direction === "Inbound") {
                this.messageCallback(data.text);
            }
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
        console.log("Sending message:", messagePayload); // Debug log
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

    // To retrieve message history, build getJWT accordingly (https://developer.genesys.cloud/commdigital/digital/webmessaging/websocketapi#retrieve-message-history) and uncomment below:
    /*

    async getJWT() {
        const messagePayload = {
            action: "getJwt",
            token: this.token
        };
        const response = await this.sendMessageWithResponse(messagePayload);
        return response.jwt;
    }

    async fetchMessageHistory(jwt, domain, pageSize = 10, pageNumber = 1) {
        const apiUrl = `https://${GCAPIEndpoint}/api/v2/webmessaging/messages?pageSize=${pageSize}&pageNumber=${pageNumber}`;
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

    */
}

export default WebSocketHandler;
