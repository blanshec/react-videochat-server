import { addUser, getUser, getUsersInRoom, removeUser } from "../userHandler";
import TEXT from "../../constants/TEXT.json";
import { Server as SocketIOServer} from 'socket.io';

//TODO Figure out how to separate methods into separate files, cuz so far I failed
export default function (io: SocketIOServer) {
    return (io.on('connection', (socket) => {
        const socketId = socket.id;

        socket.on('join', ({username, roomId}, callback) => {
            const {error, user} = addUser({id: socket.id, name: username, room: roomId});

            if (error) return callback(error);
            if (user) {
                socket.emit('message', {user: TEXT.adminName, text: `${username}, welcome!`});
                socket.broadcast.to(user.room!).emit('message', {
                    user: TEXT.adminName,
                    text: `${username} joined the chat`
                });

                socket.join(user.room!);
                io.to(user.room!).emit('roomData', getUsersInRoom({room: user.room}));

                callback();
            }
        });

        socket.on('sendMessage', (message, callback) => {
            const user = getUser({id: socketId});

            if (user) {
                io.to(user.room!).emit('message', {user: user.name, text: message});
                callback();
            }
        });

        socket.on('callRoom', (data) => {
            const user = getUser({id: socketId});

            socket.broadcast.to(user!.room!).emit('callMade', {
                offer: data.offer,
                room: data.to
            })
        });
        socket.on('makeAnswer', data => {
            socket.to(data.to).emit("answerMade", {
                socket: socketId,
                answer: data.answer
            })
        })

        socket.on('disconnectUser', () => {
            const user = removeUser({id: socketId});

            if (user) {
                io.to(user.room!).emit('message', {user: TEXT.adminName, text: `${user.name} has left the chat`});
                io.to(user.room!).emit('roomData', getUsersInRoom({room: user.room}));
            }
        });
    }))
}