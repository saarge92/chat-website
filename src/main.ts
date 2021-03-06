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
import cluster from "cluster";
import {cpus} from "os";
import compression from "compression";
import adminJobRoutes from "./routes/admin/jobs.index";
import fileUpload from "express-fileupload"
import bluebird from "bluebird";
import swagger from "swagger-ui-express";
import {swaggerDocument} from "./swagger.config";

/**
 * Server application for application
 * Contains basic information for starting web-server
 * @copyright Serdar Durdyev
 */
class ServerApplication {
    private app: Express;
    private PORT = process.env.PORT;
    private readonly MONGO_URI: string;

    constructor() {
        this.app = express();
        this.MONGO_URI = process.env.MONGO_URI as string;
    }

    private initMiddleware(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(fileUpload());
        this.app.use(cors());
        this.app.use(compression());
    }

    private initRoutes(): void {
        this.app.use("/api-docs/", swagger.serve, swagger.setup(swaggerDocument, {
            explorer: true,
        }));
        this.app.use("/api/", userRoutes);
        this.app.use("/api/", rolesRoutes);
        this.app.use("/api/", messageRoutes)
        this.app.use("/api/", roomRoutes);
        this.app.use("/api", interestRouter);
        this.app.use("/api/", adminJobRoutes);
        this.app.use(errorMiddleware);
        this.app.use("*", (request: express.Request, response: express.Response) => {
            response.json({message: "Not Found"}).status(404);
        });
    }

    private mongooseConnect() {
        global.Promise = bluebird.Promise;
        mongoose.Promise = bluebird.Promise;
        // @ts-ignore
        mongoose.connect(this.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
            console.log("Mongoose connected")
        });
    }

    public start() {
        // Try to run application in cluster mode
        const cpuCount = cpus().length;
        if (cluster.isMaster) {
            for (let i = 0; i < cpuCount; i++) cluster.fork();
            cluster.on("exit", (worker) => {
                cluster.fork();
            })
        } else {
            this.app.listen(this.PORT, () => {
                console.log("Server Started")
            });
            this.initMiddleware();
            this.initRoutes();
            this.mongooseConnect();
            WebsocketServer.init();
        }
    }
}

const newServer = new ServerApplication();
newServer.start();