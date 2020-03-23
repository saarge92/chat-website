import {MessageDto} from "../dto/message-dto";
import {IMessage} from "../models/message.model";

export interface IMessageService {
    sendMessage(messageDto: MessageDto, sender: string): Promise<IMessage>;
}