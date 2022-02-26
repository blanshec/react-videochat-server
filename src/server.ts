import express, { Application } from "express";
import { Server as SocketIOServer } from "socket.io";
import { createServer, Server as HTTPServer } from "http";
import cors from 'cors';

import Router from './routes/router';
import socketHandler from "./middlewares/socketHandler";

export class Server {
    private httpServer: HTTPServer;
    private app: Application;
    private io: SocketIOServer;

    private readonly  DEFAULT_PORT = 5000;

    constructor() {
        this.initialize();
    }

    private initialize(): void {
        this.app = express();
        this.httpServer = createServer(this.app);
        this.io = new SocketIOServer(this.httpServer, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        });

        this.handleRoutes();
        this.handleSocketConnection();
    }

    private handleRoutes(): void {
        this.app.use(cors);
        this.app.use(Router);
    }

    private handleSocketConnection(): void {
        socketHandler(this.io);
    }

    public listen(callback: (port: number) => void): void {
        this.httpServer.listen(this.DEFAULT_PORT, () =>
            callback(this.DEFAULT_PORT)
        );
    }
}