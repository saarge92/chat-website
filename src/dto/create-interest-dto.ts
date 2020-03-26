import {IsNotEmpty, Length} from "class-validator";

export class CreateInterestDto {
    @IsNotEmpty()
    @Length(3, 255)
    name: string;
}