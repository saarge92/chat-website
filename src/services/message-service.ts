import {MessageDto} from "../dto/message-dto";
import {IMessage, MessageModel} from "../models/message.model";
import {Injectable} from "@decorators/di";

@Injectable()
export class MessageService {
    public async sendMessage(messageDto: MessageDto, sender: string): Promise<IMessage> {
        return await MessageModel.create({
            sender,
            receiver: messageDto.to_id,
            message: messageDto.message
        });
    }
}