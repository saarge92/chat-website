import express from "express"
import {attachControllers} from "@decorators/express";
import {RoomController} from "../../controllers/room-controller";


const roomRoutes = express.Router()

attachControllers(roomRoutes, [RoomController]);

export default roomRoutes;