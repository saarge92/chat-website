import express from "express"
import {attachControllers} from "@decorators/express";
import {MessageController} from "../../controllers/message-controller";

const messageRoutes = express.Router()

attachControllers(messageRoutes, [MessageController]);

export default messageRoutes;