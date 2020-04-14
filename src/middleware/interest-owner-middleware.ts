import {Middleware} from "@decorators/express";
import {Inject} from "@decorators/di";
import {JwtService} from "../services/jwt-service";
import {NextFunction, Request, Response} from "express";
import HttpException from "../exceptions/http-exception";
import {InterestService} from "../services/interest-service";
import {IInterest} from "../models/interest.model";

export class InterestOwnerOrAdminMiddleware implements Middleware {
    private permittedRoles: Array<string> = ["admin"];

    constructor(@Inject(JwtService) private readonly jwtService,
                @Inject(InterestService) private readonly interestService: InterestService) {
    }

    async use(request: Request, response: Response, next: NextFunction): Promise<void> {
        if (!request.app.locals.user) {
            const token = request.headers.authorization;
            const userData = await this.jwtService.parseTokenFromHeader(token as string);

            if (!userData) throw new HttpException(400, "Ошибка авторизации")
            const interestId = request.params.id;
            const interestRequested: IInterest | any = await this.interestService.getInterestById(interestId)
                .catch((error) => {
                    return response.status(error.status || 400).json();
                });

            if (interestRequested.creator == userData.id) next();
            else {
                const roles = userData.roles;
            }
        } else {

        }
    }

}