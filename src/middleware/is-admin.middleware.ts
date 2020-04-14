import {Middleware} from "@decorators/express";
import express from "express";
import {Inject, Injectable} from "@decorators/di";
import {RoleService} from "../services/role-service";
import {JwtService} from "../services/jwt-service";
import {IUser} from "../models/user-model";
import HttpException from "../exceptions/http-exception";
import {IRoleService} from "../interfaces/i-role-service";
import {IJwtService} from "../interfaces/IJwtService";

/**
 * Middleware for executiong request for administrators
 * Contains Logic for authentication requests for users
 * @copyright Serdar Durdyev
 */
@Injectable()
export class AdminMiddleware implements Middleware {
    protected roles: Array<string> = ["admin"];

    constructor(@Inject(RoleService) private readonly roleService: IRoleService,
                @Inject(JwtService) private readonly jwtService: IJwtService) {
    }

    /**
     * Filter logic for requests
     * @param request Incoming request
     * @param response Response for user
     * @param next Next function pass request approach
     */
    public async use(request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> {
        const user: IUser = request.app.locals.user;
        if (!user) {
            const userData: IUser = await this.jwtService.parseTokenFromHeader(request.headers.authorization as string)
                .catch(error => next(error));

            const hasRoles = await this.roleService.checkRolesUser(userData, this.roles).catch(error => next(error));

            if (!hasRoles) next(new HttpException(401, "Отсутствие прав на выполняемое действия"));
            next();
        } else {
            const hasRoles = await this.roleService.checkRolesUser(user, this.roles);
            if (!hasRoles) next(new HttpException(401, "Отсутствие прав на выполняемое действия"));
            next();
        }
    }
}