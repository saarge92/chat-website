import {Middleware} from "@decorators/express";
import express from "express";
import {Inject, Injectable} from "@decorators/di";
import {RoleService} from "../services/role-service";
import {JwtService} from "../services/jwt-service";
import {IUser} from "../models/user-model";
import {RoleModel} from "../models/roles-model";
import HttpException from "../exceptions/http-exception";

/**
 * Middleware for executiong request for administrators
 * Contains Logic for authentication requests for users
 * @copyright Serdar Durdyev
 */
@Injectable()
export class AdminMiddleware implements Middleware {
    protected roles: Array<string> = ["admin"];

    constructor(@Inject(RoleService) private readonly roleService: RoleService,
                @Inject(JwtService) private readonly jwtService: JwtService) {
    }

    /**
     * Filter logic for requests
     * @param request Incoming request
     * @param response Response for user
     * @param next Next function pass request approach
     */
    public async use(request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> {
        const userData: IUser = await this.jwtService.parseTokenFromHeader(request.headers.authorization as string);
        const hasRoles = await this.checkRolesUser(userData);
        if (!hasRoles) throw new HttpException(401, "Отсутствие прав на выполняемое действия");
        next();
    }

    /**
     * Check roles of user who performs requests
     * @param user User perfoming request
     */
    private async checkRolesUser(user: IUser): Promise<boolean> {
        if (!user.roles) return false;

        const roleInTable = await RoleModel.find({name: {$in: [...this.roles]}}).lean();
        const userRoles = user.roles;

        const result = roleInTable.filter((role) => userRoles.includes(role._id.toString()));
        if (result.length <= 0) return false;
        return true;
    }
}