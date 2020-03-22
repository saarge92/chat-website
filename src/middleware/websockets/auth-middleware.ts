import {Socket} from "socket.io";
import {NextFunction} from "express";
import {JwtService} from "../../services/jwt-service";

export async function authMiddlewareWebsocket(socket: Socket, next: NextFunction) {
    try {
        const token = socket.handshake.query.token;
        if (!token) next(new Error("Set jwt for socket"));
        const jwtService = new JwtService();
        const userData = await jwtService.getUserFromToken(token);
        if (!userData) next(new Error("Something went wrong"));
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