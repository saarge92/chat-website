import { Controller, Params, Post, Response as ResponseDecorator, Request as RequestDecorator, Get, Delete } from "@decorators/express";
import { Request, Response } from "express";
import { transformAndValidate } from "class-transformer-validator";
import { CreateInterestDto } from "../dto/create-interest-dto";
import { Inject } from "@decorators/di";
import { InterestService } from "../services/interest-service";
import { AuthMiddleware } from "../middleware/auth-middleware";
import { IUser } from "../models/user-model";
import { Types } from "mongoose";
import HttpException from "../exceptions/http-exception";
import { InterestOwnerOrAdminMiddleware } from "../middleware/interest-owner-middleware";

/**
 * Controller for interests of user
 * Contains basic methods for CRUD of interests
 *
 * @copyright Serdar Durdyev
 */
@Controller("/interest")
export class InterestController {
    constructor(@Inject(InterestService) private readonly interestService: InterestService) {
    }

    /**
     * Add add interest by user in database
     * @param request Request Request body with message parameters
     * @param response Response for user
     */
    @Post("/", [AuthMiddleware])
    public async createInterest(request: Request, response: Response) {
        const createInterestDto = await transformAndValidate(CreateInterestDto, request.body).catch((error) => {
            return response.status(400).json({ ...error });
        }) as CreateInterestDto;

        const currentUser: IUser = request.app.locals.user;
        const createInterest = await this.interestService.createInterest(createInterestDto, Types.ObjectId(currentUser._id));
        await this.interestService.addUserToInterest(currentUser._id, createInterest._id);

        return response.status(200).json({ id: createInterest._id, name: createInterest.name });
    }

    /**
     * Try assign user to interest
     * @param interestId Id of interest
     * @param request Request of user
     * @param response Response json for user
     */
    @Post("/assign/:id", [AuthMiddleware])
    public async assignInterestForUser(@Params("id") interestId: string, @RequestDecorator() request: Request,
        @ResponseDecorator() response: Response) {
        const user = request.app.locals.user;
        const isUpdated = await this.interestService.tryAssignInterestForUser(user._id, interestId);
        return response.json({ isUpdated }).status(200)
    }

    /**
     * Get all interests in our system
     * @param request Http request
     * @param response Http response
     */
    @Get("/")
    public async getAllInterests(request: Request, response: Response) {
        // tslint:disable-next-line:radix
        const currentPage = request.query.currentPage ? parseInt(request.query.currentPage) : 1;
        // tslint:disable-next-line:radix
        const perPage = request.query.perPage ? parseInt(request.query.perPage) : 12;

        const allInterests = await this.interestService.getInterests(currentPage, perPage)
            .catch(error => {
                return response.status(500).json({ ...error })
            });

        return response.status(200).json(allInterests);
    }

    /**
     * Delete interest from database
     * @param id Id of deleting interest
     * @param response Response for deleted
     */
    @Delete("/:id", [AuthMiddleware, InterestOwnerOrAdminMiddleware])
    public async deleteInterest(@Params("id") id: string, @ResponseDecorator() response: Response) {
        if (!id) throw new HttpException(400, "Укажите id для удаления интереса");
        await this.interestService.deleteInterest(id).catch((error) => {
            return response.status(error.status || 400).json({ message: error.message || "Что-то пошло не так, Проверьте id" });
        });
        return response.status(400).json({ message: "Удаленно" });
    }
}