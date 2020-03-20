import express, {Express} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/user";
import mongoose from "mongoose";
import * as socketServer from "socket.io";
import "dotenv/config"
import errorMiddleware from "./middleware/error.middleware";
import rolesRoutes from "./routes/user/roles";
import {Socket} from "socket.io";
import {authMiddlewareWebsocket} from "./middleware/websockets/auth-middleware";
import messageRoutes from "./routes/message/message-route";

class ServerApplication {
    private app: Express;
    private PORT = process.env.PORT;
    private MONGO_URI = process.env.MONGO_URI;
    private socket: socketServer.Server;

    constructor() {
        this.app = express();
    }

    private initMiddleware() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(cors());
    }

    private initRoutes() {
        this.app.use("/api/", userRoutes);
        this.app.use("/api/", rolesRoutes);
        this.app.use("/api/", messageRoutes)
        this.app.use(errorMiddleware);
        this.app.use("*", (request: express.Request, response: express.Response) => {
            response.json({message: "Not Found"}).status(404);
        });
    }

    private mongooseConnect() {
        mongoose.Promise = global.Promise;
        // @ts-ignore
        mongoose.connect(this.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
            console.log("Mongoose connected")
        });
    }

    private socketInit() {
        this.socket = socketServer.listen(9090);
        this.socket.of("/chat").use(authMiddlewareWebsocket).on("connection", (socket) => {
            socket.emit("server", {data: "Hello from DMASTERS"})
        })
    }

    public start() {
        this.app.listen(this.PORT, () => {
            console.log("Server Started")
        });
        this.initMiddleware();
        this.initRoutes();
        this.mongooseConnect();
        this.socketInit();
    }
}

const newServer = new ServerApplication();
newServer.start();