import Queue, {Job} from "bull"
import {UserModel} from "../models/user-model";
import {WebsocketServer} from "../websocket/websocket.server";
import {redisSettings} from "../constants/redis-queue-settings";

// @ts-ignore
export const countUsersQueue = new Queue("count-of-users", redisSettings);

/**
 * This job will proccess operations about users count in the database
 */
countUsersQueue.process(async (job: Job, done) => {
    const countUsers = await UserModel.count().exec()
    WebsocketServer.server.of("/admin").emit("user-count", {data: countUsers})
    done(null, countUsers)
})