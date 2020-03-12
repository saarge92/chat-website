import {IsEmail, IsNotEmpty, Length, MinLength} from "class-validator";

export class UserInfo {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Length(6, 120)
    @IsNotEmpty({message: 'ass'})
    password: string;
}