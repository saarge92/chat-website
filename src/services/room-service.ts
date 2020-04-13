import { Injectable } from "@decorators/di";
import { CreateRoomDto } from "../dto/create-room-dto";
import { IRoom, RoomModel } from "../models/room.model";
import { IRoomService } from "../interfaces/i-room-service";

/**
 * Room service for creating room in our system
 */
@Injectable()
export class RoomService implements IRoomService {

    /**
     * Get all room in our system
     * @returns {Promise<IRoom[]>} Список доступных комнат в системе
     */
    async getRooms(): Promise<any[]> {
        const listRooms = await RoomModel.find().lean();
        return listRooms.map((room: IRoom) => {
            return {
                id: room._id,
                interests: room.interests,
                name: room.name,
                created_at: room.created_at
            }
        });
    }
    
    /**
     * Create room in database by user
     * @param roomDto Object with data about room
     * @param idUser Current user who creating room
     */
    public async createRoom(roomDto: CreateRoomDto, idUser: string): Promise<IRoom> {
        return await RoomModel.create({
            name: roomDto.name,
            creator: idUser
        })
    }

    /**
     * Get room info by id
     * @param id Id of requested room
     */
    public async getRoomInfoById(id: string): Promise<IRoom> {
        return RoomModel.findOne({ _id: id }).lean();
    }

    /**
     * Check user in out system
     * @param id Id of requested user
     * @return {Promise<boolean>} Returns boolean if exists
     */
    public async roomExists(id: string): Promise<boolean> {
        return (await this.getRoomInfoById(id)) != null;
    }

    /**
     * Delete room by id
     * @param id Id of requested room for delete
     */
    public async deleteRoom(id: string) {
        const isDeletedInfo = await RoomModel.deleteOne({ _id: id });
        return isDeletedInfo;
    }
}