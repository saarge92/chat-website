import {IsEmail, IsNotEmpty, Length, MinLength} from "class-validator";

export class RoleInfo {
    @IsNotEmpty()
    @Length(2, 255)
    name: string;
}