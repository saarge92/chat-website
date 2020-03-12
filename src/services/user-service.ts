import {UserInfo} from "../dto/user-info.dto";
import {Injectable} from "@decorators/di";
import {UserModel} from "../models/user-model";
import bcrypt from "bcrypt";

/**
 * Service for working with users
 */
@Injectable()
export class UserService {
    private readonly salt: number = 10;

    public async registerUser(userInfo: UserInfo): Promise<any> {
        const createdUser = await UserModel.create({
            email: userInfo.email,
            password: bcrypt.hashSync(userInfo.password, this.salt)
        });
        return {
            email: createdUser.email,
            created_at: createdUser.created_at
        };
    }
}