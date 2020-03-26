import express from "express"
import {attachControllers} from "@decorators/express";
import {InterestController} from "../controllers/interest-controller";

const interestRouter = express.Router()

attachControllers(interestRouter, [InterestController]);

export default interestRouter;
