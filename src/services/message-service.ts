import {MessageDto} from "../dto/message-dto";
import {IMessage, MessageModel} from "../models/message.model";
import {Injectable} from "@decorators/di";
import {IMessageService} from "../interfaces/i-message-service";
import {WebsocketServer} from "../websocket/websocket.server";
import {Types} from "mongoose";

/**
 * Service class for sending messages for system
 * @copyright Serdar Durdyev
 */
@Injectable()
export class MessageService implements IMessageService {

    /**
     * Sending message by user
     * @param messageDto Data about sended message
     * @param sender Who sent this message
     */
    public async sendMessage(messageDto: MessageDto, sender: string): Promise<IMessage> {
        const createdMessage = await MessageModel.create({
            sender: Types.ObjectId(sender),
            reciever: Types.ObjectId(messageDto.to_id),
            message: messageDto.message
        });

        WebsocketServer.server.of("/chat").to(`private-chat-${createdMessage.reciever}`).emit("message", {
            message: createdMessage.message,
            sender: createdMessage.sender
        });
        return createdMessage;
    }
}