import {Controller, Params, Post, Response as ResponseDecorator, Request as RequestDecorator} from "@decorators/express";
import {Request, Response} from "express";
import {transformAndValidate} from "class-transformer-validator";
import {CreateInterestDto} from "../dto/create-interest-dto";
import {Inject} from "@decorators/di";
import {InterestService} from "../services/interest-service";
import {AuthMiddleware} from "../middleware/auth-middleware";
import {IUser} from "../models/user-model";

/**
 * Controller for interests of user
 * Contains basic methods for CRUD of interests
 *
 * @copyright Serdar Durdyev
 */
@Controller("/interest", [AuthMiddleware])
export class InterestController {
    constructor(@Inject(InterestService) private readonly interestService: InterestService) {
    }

    /**
     * Add add interest by user in database
     * @param request Request Request body with message parameters
     * @param response Response for user
     */
    @Post("/")
    public async createInterest(request: Request, response: Response) {
        const createInterestDto = await transformAndValidate(CreateInterestDto, request.body).catch((error) => {
            return response.json({...error}).status(400);
        }) as CreateInterestDto;

        const currentUser: IUser = request.app.locals.user;
        const createInterest = await this.interestService.createInterest(createInterestDto);
        await this.interestService.addUserToInterest(currentUser._id, createInterest._id);

        return response.status(200).json({id: createInterest._id, name: createInterest.name});
    }

    /**
     * Try assign user to interest
     * @param interestId Id of interest
     * @param request Request of user
     * @param response Response json for user
     */
    @Post("/assign/:id")
    public async assignInterestForUser(@Params("id")interestId: string, @RequestDecorator() request: Request,
                                       @ResponseDecorator() response: Response) {
        const user = request.app.locals.user;
        const isUpdated = await this.interestService.tryAssignInterestForUser(user._id, interestId);
        return response.json({isUpdated}).status(200)
    }
}