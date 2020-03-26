import {Controller, Post} from "@decorators/express";
import {Request, Response} from "express";
import {transformAndValidate} from "class-transformer-validator";
import {CreateInterestDto} from "../dto/create-interest-dto";
import {Inject} from "@decorators/di";
import {InterestService} from "../services/interest-service";
import {AuthMiddleware} from "../middleware/auth-middleware";

@Controller("/interest", [AuthMiddleware])
export class InterestController {
    constructor(@Inject(InterestService) private readonly interestService: InterestService) {
    }

    @Post("/")
    public async createInterest(request: Request, response: Response) {
        const createInterestDto = await transformAndValidate(CreateInterestDto, request.body).catch((error) => {
            return response.json({...error}).status(400);
        }) as CreateInterestDto;

        const createInterest = await this.interestService.createInterest(createInterestDto);
        return response.status(200).json({id: createInterest._id, name: createInterest.name});
    }
}