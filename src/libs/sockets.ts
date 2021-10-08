import { Application } from "express"
import { Server as HTTPServer } from 'http'
import { Server, Socket } from 'socket.io'

export class SocketIO {
    private app: Application
    private server: HTTPServer
    private io: Server

    constructor(
        app: Application,
        server: HTTPServer,
        io: Server
    ) {
        this.app = app
        this.server = server
        this.io = io
    }

    sendMessage(msg: string) {
 
    }

    receivedMessage() {

    }
}