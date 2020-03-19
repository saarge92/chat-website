import express from "express"
import {attachControllers} from "@decorators/express";
import {RoleController} from "../../controllers/role.controller";

const rolesRoutes = express.Router()

attachControllers(rolesRoutes, [RoleController]);


export default rolesRoutes;
