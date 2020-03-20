import {Controller, Post} from "@decorators/express";
import {Request, Response} from "express";
import {transformAndValidate} from "class-transformer-validator";
import {MessageDto} from "../dto/message-dto";
import {AuthMiddleware} from "../middleware/auth-middleware";
import {Inject} from "@decorators/di";
import {MessageService} from "../services/message-service";

@Controller("/messages", [AuthMiddleware])
export class MessageController {
    constructor(@Inject(MessageService) private readonly messageService: MessageService) {
    }

    @Post("/")
    public async messagePost(request: Request, response: Response) {
        const message = await transformAndValidate(MessageDto, request.body).catch((error) => {
            return response.json({message: error}).status(400);
        });
        const newMessage = await this.messageService.sendMessage(message as MessageDto, request.app.locals.user._id);
        return response.json({
            id: newMessage._id,
            reciever: newMessage.reciever,
            sender: newMessage.sender,
            created_at: newMessage.created_at
        }).status(200)
    }
}