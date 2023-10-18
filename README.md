Genesys Cloud Custom Web Messaging Widget.

This project provides a simple integration with Genesys Cloud's Web messaging Guest API to facilitate web messaging through a custom interface.

Features:
Real-time chat using Web messaging Guest API.
Responsive design suitable for desktop and mobile devices.
Simple error handling and logging for debugging.

Environment Variables:
Before deploying or running the project, ensure you've set up the necessary environment variables on your hosting platform. The required environment variables are fetched from /api/getConfig.js. These variables include:

GCWSSEndpoint
GCMessagingDeplId
(Any other variable you added to /api/getConfig.js)

Usage:

Open the chat interface.
Type a message and either press the "Send" button or the "Enter" key to send the message.
That message will be routed to the Web Messaging Deployment set in the environment variables.
Inbound and outbound (agent responses) messages will be displayed in the chat window.
Notes:
This is a basic integration, and further enhancements can be made, such as implementing message history retrieval or handling different types of messages beyond just text.
Ensure that the environment variables are correctly set up in your hosting platform to avoid any runtime issues.
