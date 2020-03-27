import {IsEmail, IsEmpty, IsNotEmpty, IsString, Length} from "class-validator";

export class EmailDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @Length(1, 1024)
    body: string;

    @IsEmpty()
    subject?: string;
}