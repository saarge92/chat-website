import {Middleware} from "@decorators/express";
import {Inject} from "@decorators/di";
import {JwtService} from "../services/jwt-service";
import {NextFunction, Request, Response} from "express";
import HttpException from "../exceptions/http-exception";
import {InterestService} from "../services/interest-service";
import {IInterest} from "../models/interest.model";
import {RoleService} from "../services/role-service";
import {IUser} from "../models/user-model";

/**
 * Middleware for checking who can delete
 * specific interest from database
 *
 * @copyright Picasso
 */
export class InterestOwnerOrAdminMiddleware implements Middleware {
    private permittedRoles: Array<string> = ["admin"];

    constructor(@Inject(JwtService) private readonly jwtService,
                @Inject(RoleService) private readonly roleService: RoleService,
                @Inject(InterestService) private readonly interestService: InterestService) {
    }

    /**
     * Logic of authorization request when interest is deleting/updating
     * @param request Current http request
     * @param response Response for user
     * @param next Function for passing request futher
     */
    async use(request: Request, response: Response, next: NextFunction): Promise<void> {
        const interestId = request.params.id;
        if (!request.app.locals.user) {
            const token = request.headers.authorization;
            const userData = await this.jwtService.parseTokenFromHeader(token as string);

            if (!userData) throw new HttpException(400, "Ошибка авторизации")
            const hasRoles = await this.hasCredentials(interestId, userData);
            if (!hasRoles) next(new HttpException(401, "У вас не достаточно прав"));
            else next();
        } else {
            const userData = request.app.locals.user;
            const hasRoles = await this.hasCredentials(interestId, userData);
            if (!hasRoles) next(new HttpException(401, "У вас не достаточно прав"));
            else next();
        }
    }

    /**
     * Check credentials for users interests
     * @param interestId Id of interest
     * @param userData Current user who performs the request
     */
    private async hasCredentials(interestId: string, userData: IUser) {
        const interestRequested: IInterest | any = await this.interestService.getInterestById(interestId);
        if (interestRequested.creator.equals(userData._id)) return true;
        else {
            const hasRoles = await this.roleService.checkRolesUser(userData, this.permittedRoles);
            return hasRoles;
        }
    }

}