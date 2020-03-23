import {MessageDto} from "../dto/message-dto";
import {IMessage, MessageModel} from "../models/message.model";
import {Injectable} from "@decorators/di";
import {IMessageService} from "../interfaces/i-message-service";

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
        return await MessageModel.create({
            sender,
            receiver: messageDto.to_id,
            message: messageDto.message
        });
    }
}