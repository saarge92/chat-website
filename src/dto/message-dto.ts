import {IsMongoId, IsNotEmpty, IsString} from "class-validator";

export class MessageDto {
    @IsNotEmpty()
    message: string;

    @IsNotEmpty()
    @IsMongoId()
    to_id: string;
}