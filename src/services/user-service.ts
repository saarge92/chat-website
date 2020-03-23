import {UserInfo} from "../dto/user-info.dto";
import {Inject, Injectable} from "@decorators/di";
import {IUser, UserModel} from "../models/user-model";
import bcrypt from "bcrypt";
import HttpException from "../exceptions/http-exception";
import {LoginInfo} from "../dto/login-info";
import {JwtService} from "./jwt-service";
import {RoleService} from "./role-service";
import {IUserService} from "../interfaces/i-user-service";
import {IJwtService} from "../interfaces/IJwtService";
import {IRoleService} from "../interfaces/i-role-service";

/**
 * Service for working with users
 * @copyright Picasso
 */
@Injectable()
export class UserService implements IUserService {
    private readonly salt: number = 10;

    constructor(@Inject(JwtService) private readonly jwtService: IJwtService,
                @Inject(RoleService) private readonly roleService: IRoleService) {
    }

    /**
     * Register user in database
     * @param userInfo Body of registering users
     */
    public async registerUser(userInfo: UserInfo): Promise<any> {
        const userExists = await this.userExistByEmail(userInfo.email);
        let createdUser: any = {};
        if (!userExists) {
            const userRole = await this.roleService.getRoleByName("admin");
            if (userRole) createdUser = await UserModel.create({
                email: userInfo.email,
                password: bcrypt.hashSync(userInfo.password, this.salt),
                roles: [userRole._id]
            });
            else createdUser = await UserModel.create({
                email: userInfo.email,
                password: bcrypt.hashSync(userInfo.password, this.salt)
            });
            return {
                email: createdUser.email,
                id: createdUser._id,
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
        return UserModel.find({email}).findOne().lean();
    }

    /**
     * Check if user exists
     * @param email Email of requested user
     */
    public async userExistByEmail(email: string): Promise<boolean> {
        const userByEmail = await this.getUserByEmail(email);
        return userByEmail !== null && userByEmail !== undefined;
    }

    /**
     * Login user in system
     * @param userInfo users email & password for checking
     * @returns {Promise<any>} Returns async result with token &  email user
     */
    public async userLogin(userInfo: LoginInfo): Promise<any> {
        const user = await this.getUserByEmail(userInfo.email);
        if (!user) throw new HttpException(400, "Неверный логин или пароль");
        const isPasswordCorrect = bcrypt.compareSync(userInfo.password, user.password);
        if (isPasswordCorrect) {
            const token = await this.jwtService.signUser(user);
            return {
                token,
                email: user.email,
                id: user._id
            };
        }
        throw new HttpException(400, "Неверный логин или пароль");
    }
}