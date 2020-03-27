import express from "express"
import {attachControllers} from "@decorators/express";
import {AdminJobController} from "../../controllers/admin-job-controller";

const adminJobRoutes = express.Router()

attachControllers(adminJobRoutes, [AdminJobController]);

export default adminJobRoutes;