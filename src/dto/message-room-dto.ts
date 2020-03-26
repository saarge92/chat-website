import {IsNotEmpty, IsString, Length} from "class-validator";

export class MessageRoomDto {
    @IsNotEmpty()
    @IsString()
    @Length(1, 255)
    message: string;
}