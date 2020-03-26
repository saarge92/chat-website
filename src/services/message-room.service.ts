import {Inject, Injectable} from "@decorators/di";
import {IUser} from "../models/user-model";
import {InterestService} from "./interest-service";
import {IRoom, RoomModel} from "../models/room.model";
import HttpException from "../exceptions/http-exception";
import {MessageRoomDto} from "../dto/message-room-dto";

@Injectable()
export class MessageRoomService {
    constructor(@Inject(InterestService) private readonly interestService: InterestService) {
    }

    public async sendMessageToRoom(user: IUser, roomInfo: MessageRoomDto, roomId: string) {
        const room = (await RoomModel.findOne({_id: roomId}).exec());
        if (!room) throw new HttpException(400, "Такой комнаты не существует");

        const hasUserPermission = await this.interestService.hasPermissionForRoom(user, room);
        if (!hasUserPermission) throw new HttpException(400, "У вас нет разрешения на отправку сообщения");
        return {
            message: "Oh yeah"
        }
    }
}