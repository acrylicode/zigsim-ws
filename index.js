const dgram = require('dgram');
const WebSocket = require('ws');

function init(updPort = 50000, wsServerPort = 8080) {
    const updServer = dgram.createSocket('udp4');
    const wss = new WebSocket.Server({ port: wsServerPort });
    console.log(`websocket server listening on port: ${wsServerPort}`)

    wss.on('connection', (ws) => {
        console.log(`New client connected to the websocket. Number of clients: ${wss.clients.size}`)
    });

    updServer.on('error', (err) => {
        console.log(`upd server error:\n${err.stack}`);
        updServer.close();
    });

    updServer.on('message', (msg) => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg.toString())
            }
        });
    });

    updServer.on('listening', () => {
        const address = updServer.address();
        console.log(`udp server listening on port: ${address.port}`);
    });
    updServer.bind(updPort);
}

module.exports.init = init;
