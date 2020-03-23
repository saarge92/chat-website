import {UserInfo} from "../dto/user-info.dto";
import {IUser} from "../models/user-model";
import {LoginInfo} from "../dto/login-info";

/**
 * Interface containing
 */
export interface IUserService {
    registerUser(userInfo: UserInfo): Promise<any>;

    getUserByEmail(email: string): Promise<IUser>;

    userExistByEmail(email: string): Promise<boolean>;

    userLogin(userInfo: LoginInfo): Promise<any>
}