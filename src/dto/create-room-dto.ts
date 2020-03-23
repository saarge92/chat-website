import {IsNotEmpty, Length} from "class-validator";

export class CreateRoomDto {
    @IsNotEmpty()
    @Length(3, 255)
    name: string;
}