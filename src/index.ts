import { Server } from "./server";

const server = new Server();

server.listen((port) => {
    console.log(`Server up and running on localhost:${port}`);
})