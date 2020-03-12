import {UserInfo} from "../dto/user-info.dto";
import {Injectable} from "@decorators/di";
import {IUser, UserModel} from "../models/user-model";
import bcrypt from "bcrypt";
import HttpException from "../exceptions/http-exception";

/**
 * Service for working with users
 * @copyright Picasso
 */
@Injectable()
export class UserService {
    private readonly salt: number = 10;

    /**
     * Register user in database
     * @param userInfo Body of registering users
     */
    public async registerUser(userInfo: UserInfo): Promise<any> {
        const userExists = await this.userExistByEmail(userInfo.email);
        if (!userExists) {
            const createdUser = await UserModel.create({
                email: userInfo.email,
                password: bcrypt.hashSync(userInfo.password, this.salt)
            });
            return {
                email: createdUser.email,
                created_at: createdUser.created_at
            };
        }
        throw new HttpException(400, "Пользователь уже существует");
    }

    /**
     * Get user by email
     * @param email Email of user
     */
    public async getUserByEmail(email: string): Promise<IUser> {
        return Promise.resolve(UserModel.find({email}).findOne());
    }

    /**
     * Check if user exists
     * @param email
     */
    public async userExistByEmail(email: string): Promise<boolean> {
        const userByEmail = await this.getUserByEmail(email);
        return userByEmail !== null && userByEmail !== undefined;
    }
}