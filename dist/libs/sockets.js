"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIO = void 0;
class SocketIO {
    constructor(app, server, io) {
        this.app = app;
        this.server = server;
        this.io = io;
    }
    sendMessage(msg) {
    }
    receivedMessage() {
    }
}
exports.SocketIO = SocketIO;
