import * as socketServer from "socket.io";
import "dotenv/config";
import {authMiddlewareWebsocket} from "../middleware/websockets/auth-middleware";
import {Socket} from "socket.io";

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
        this.server = socketServer.listen(9090);
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
    }
}