import express, {Express} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/user";
import mongoose from "mongoose";
import "dotenv/config"
import errorMiddleware from "./middleware/error.middleware";
import rolesRoutes from "./routes/user/roles";
import messageRoutes from "./routes/message/message-route";
import {WebsocketServer} from "./websocket/websocket.server";
import roomRoutes from "./routes/room/room";
import interestRouter from "./routes/interest-route";

/**
 * Server application for application
 * Contains basic information for starting web-server
 * @copyright Serdar Durdyev
 */
class ServerApplication {
    private app: Express;
    private PORT = process.env.PORT;
    private MONGO_URI = process.env.MONGO_URI;

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
        this.app.use("/api/", roomRoutes);
        this.app.use("/api", interestRouter);
        this.app.use(errorMiddleware);
        this.app.use("*", (request: express.Request, response: express.Response) => {
            response.json({message: "Not Found"}).status(404);
        });
    }

    private mongooseConnect() {
        mongoose.Promise = Promise;
        // @ts-ignore
        mongoose.connect(this.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
            console.log("Mongoose connected")
        });
    }

    public start() {
        this.app.listen(this.PORT, () => {
            console.log("Server Started")
        });
        this.initMiddleware();
        this.initRoutes();
        this.mongooseConnect();
        WebsocketServer.init();
    }
}

const newServer = new ServerApplication();
newServer.start();