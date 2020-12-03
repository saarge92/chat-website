import * as socketServer from "socket.io";
import "dotenv/config";
import {authMiddlewareWebsocket} from "../middleware/websockets/auth-middleware";
import {Socket} from "socket.io";
import socketRedis from "socket.io-redis";
import {v4 as uuidV4} from "uuid"

/**
 * Websocket server for serving request in real-time
 * using websockets
 * @copyright Serdar Durdyev
 */
export class WebsocketServer {
    public static server: socketServer.Server;

    /**
     * Init websocket server connection & apply middlewares
     */
    public static init() {
        this.server = socketServer.listen(9090, {adapter: socketRedis({host: process.env.REDIS_HOST, port: process.env.REDIS_PORT})});
        this.initMiddlewares();

    }

    /**
     * Init middleware for websocket server
     */
    private static initMiddlewares() {
        this.initChatMiddleware();
        this.initInterestRoomMiddleware();
    }

    /**
     * Init middleware for private one user chat server
     */
    private static initChatMiddleware() {
        this.server.of("/chat").use(authMiddlewareWebsocket)
            .on("connection", (socket) => {
                socket.emit("server", {data: "Hello from DMASTERS"})
                const userData = socket.handshake.query["user-data"];
                socket.join(`private-chat-${userData.id}`)
            });
    }

    /**
     * Init middleware for socket
     * where users can connect using their interests
     */
    private static initInterestRoomMiddleware() {
        this.server.of("/interest").use(authMiddlewareWebsocket).on("connection", (socket: Socket) => {
            socket.on("room-connect", (roomData: any) => {
                socket.join(`interest-${roomData.data}`);
            });
        });
        this.server.of("videochat").use(authMiddlewareWebsocket).on("connection", (socket) => {
            socket.on("call-made", (confidata: any) => {
                socket.broadcast.emit("call-made", confidata);
            })
            socket.on("call-response", (data: any) => {
                const fromCallSocketRespose = this.server.of("videochat").connected[data.from]
                const toSocketResponse = this.server.of("videochat").connected[data.to]
                const roomId = uuidV4()
                fromCallSocketRespose.join(roomId.toString())
                toSocketResponse.join(roomId.toString())
                for (const socketParticipant of [fromCallSocketRespose, toSocketResponse]) {
                    socketParticipant.emit("call-response", {
                        from: data.from,
                        to: data.to,
                        sdp: data.sdp,
                        roomId: roomId.toString()
                    })
                }
            })
            socket.on("call-response-full", (data: any) => {
                socket.broadcast.emit("call-response-full", data);
            })
        });
    }
}