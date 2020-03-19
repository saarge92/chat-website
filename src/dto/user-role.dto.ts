import {IsNotEmpty, IsString} from "class-validator";

/**
 * Data transfer object for
 * transferting information about assignation info
 * @copyright Serdar Durdyev
 */
export class UserRoleDto {
    @IsNotEmpty()
    @IsString()
    user_id: string;

    @IsNotEmpty()
    @IsString()
    role_id: string;
}