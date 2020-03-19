import {IsEmail, IsNotEmpty, Length} from "class-validator";

export class LoginInfo {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty({message: 'must be not empty'})
    @Length(6, 255)
    password: string;
}