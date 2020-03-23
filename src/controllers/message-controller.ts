import {Controller, Post} from "@decorators/express";
import {Request, Response} from "express";
import {transformAndValidate} from "class-transformer-validator";
import {MessageDto} from "../dto/message-dto";
import {AuthMiddleware} from "../middleware/auth-middleware";
import {Inject} from "@decorators/di";
import {MessageService} from "../services/message-service";
import {WebsocketServer} from "../websocket/websocket.server";
import {IMessageService} from "../interfaces/i-message-service";

/**
 * Controller for sending messages users each others
 * @copyright Serdar Durdyev
 */
@Controller("/messages", [AuthMiddleware])
export class MessageController {
    constructor(@Inject(MessageService) private readonly messageService: IMessageService) {
    }

    /**
     * Sending messaging user to another user
     * @param request Request contains data
     * @param response Response for user after sending information
     */
    @Post("/")
    public async messagePost(request: Request, response: Response) {
        const message = await transformAndValidate(MessageDto, request.body).catch((error) => {
            return response.json({message: error}).status(400);
        });
        const newMessage = await this.messageService.sendMessage(message as MessageDto, request.app.locals.user._id);
        WebsocketServer.server.of("/chat").to(`private-chat-${newMessage.sender}`).emit("message", {
            message: newMessage.message,
            sender: newMessage.sender
        });
        return response.json({
            id: newMessage._id,
            reciever: newMessage.reciever,
            sender: newMessage.sender,
            created_at: newMessage.created_at
        }).status(200)
    }

    @Post("/room/:id")
    public async sendMessageToRoom(request:Request,response:Response)
    {
        
    }
}