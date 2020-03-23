import {CreateRoomDto} from "../dto/create-room-dto";
import {IRoom} from "../models/room.model";

/**
 * Interface for business logic
 * with rooms in our system
 * @copyright Serdar Durdyev
 */
export interface IRoomService {
    createRoom(roomDto: CreateRoomDto, idUser: string): Promise<IRoom>;

    getRoomInfoById(id: string): Promise<IRoom>;
}