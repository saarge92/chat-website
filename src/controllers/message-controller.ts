import {Controller, Params, Response as ResponseDecorator, Post, Request as RequestDecorator} from "@decorators/express";
import {Request, Response} from "express";
import {transformAndValidate} from "class-transformer-validator";
import {MessageDto} from "../dto/message-dto";
import {AuthMiddleware} from "../middleware/auth-middleware";
import {Inject} from "@decorators/di";
import {MessageService} from "../services/message-service";
import {IMessageService} from "../interfaces/i-message-service";
import {IUser} from "../models/user-model";
import {MessageRoomService} from "../services/message-room.service";
import {MessageRoomDto} from "../dto/message-room-dto";
import {AdminMiddleware} from "../middleware/is-admin.middleware";

/**
 * Controller for sending messages users each others
 * @copyright Serdar Durdyev
 */
@Controller("/messages", [AuthMiddleware])
export class MessageController {
    constructor(@Inject(MessageService) private readonly messageService: IMessageService,
                @Inject(MessageRoomService) private readonly messageRoomService: MessageRoomService
    ) {
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

        return response.json({
            id: newMessage._id,
            reciever: newMessage.reciever,
            sender: newMessage.sender,
            created_at: newMessage.created_at
        }).status(200)
    }

    /**
     * Send message by user into room
     * @param request Request with body of message
     * @param response Response of result sended message
     */
    @Post("/room/:id",[AdminMiddleware])
    public async sendMessageToRoom(@Params("id") roomId: string, @RequestDecorator() request: Request, @ResponseDecorator() response: Response) {
        const currentUser: IUser = request.app.locals.user;
        const messageToRoom = await transformAndValidate(MessageRoomDto, request.body).catch((error) => {
            response.json({...messageToRoom}).status(400)
        }) as MessageRoomDto;

        const message = await this.messageRoomService.sendMessageToRoom(currentUser, messageToRoom, roomId);
        return response.json(message).status(200);
    }
}