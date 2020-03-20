import {Middleware} from "@decorators/express";
import {NextFunction, Request, Response} from "express";
import {Inject} from "@decorators/di";
import {JwtService} from "../services/jwt-service";
import HttpException from "../exceptions/http-exception";

export class AuthMiddleware implements Middleware {

    constructor(@Inject(JwtService) private readonly jwtService: JwtService) {
    }

    public async use(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const token = request.headers.authorization;
            const userData = await this.jwtService.parseTokenFromHeader(token as string);
            if (!userData) throw new HttpException(400, "Ошибка авторизации")
            request.app.locals.user = userData;
            next();
        } catch (error) {
            throw new HttpException(error.status || 500, error.message || "Что-то пошло не так")
        }
    }

}