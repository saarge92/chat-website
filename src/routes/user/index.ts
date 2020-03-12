import express from "express"
import {UserController} from "../../controllers/user.controller";
import {attachControllers} from "@decorators/express";

const userRoutes = express.Router()

attachControllers(userRoutes, [UserController]);

export default userRoutes;
