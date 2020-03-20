import {IsNotEmpty, IsString} from "class-validator";

export class MessageDto {
    @IsNotEmpty()
    message: string;

    @IsNotEmpty()
    @IsString()
    to_id: string;
}