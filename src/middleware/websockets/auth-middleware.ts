import {Socket} from "socket.io";
import {NextFunction} from "express";
import {JwtService} from "../../services/jwt-service";
import {Container} from "@decorators/di";
import {IJwtService} from "../../interfaces/IJwtService";

/**
 * Authenticate private user in websocket
 * Only authenticated users can connect to websocket
 * @param socket Socket connection from client, which contains jwt data
 * @param next Next function for passing websocket connection approach
 */
export async function authMiddlewareWebsocket(socket: Socket, next: NextFunction) {
    try {
        const token = socket.handshake.query.token;
        if (!token) next(new Error("Set jwt for socket"));

        const jwtService = Container.get<IJwtService>(JwtService);
        const userData = await jwtService.getUserFromToken(token);

        if (!userData) next(new Error("Something went wrong"));
        // If user-data is alright then pass additional information about socket connection approach
        socket.handshake.query["user-data"] = {
            id: userData._id,
            email: userData.email
        };

        next();
    } catch (error) {
        console.log(error)
        next(new Error(error));
    }
}

