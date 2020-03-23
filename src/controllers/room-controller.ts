import {Controller, Post} from "@decorators/express";
import {Request, Response} from "express";
import {transformAndValidate} from "class-transformer-validator";
import {CreateRoomDto} from "../dto/create-room-dto";
import {AuthMiddleware} from "../middleware/auth-middleware";
import {Inject} from "@decorators/di";
import {RoomService} from "../services/room-service";
import {IRoomService} from "../interfaces/i-room-service";

/**
 * Controller for create,update & delete rooms in out system
 * @copyright Serdar Durdyev
 */
@Controller("/room", [AuthMiddleware])
export class RoomController {
    constructor(@Inject(RoomService) private readonly roomService: IRoomService) {
    }

    /**
     * Create room by user of our system
     * @param request Request with body of rooms creation
     * @param response Reponse for creation room
     */
    @Post("/")
    public async createRoom(request: Request, response: Response) {
        const roomDto = await transformAndValidate(CreateRoomDto, request.body).catch((error) => {
            return response.json({...error}).status(400);
        }) as CreateRoomDto;

        const currentUserId = request.app.locals.user._id;
        const createdRoom = await this.roomService.createRoom(roomDto, currentUserId);

        return response.json({id: createdRoom._id, created_at: createdRoom.created_at, creator: createdRoom.creator})
            .status(200);
    }
}