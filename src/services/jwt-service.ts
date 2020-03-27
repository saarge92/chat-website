import {Injectable} from "@decorators/di";
import {IUser, UserModel} from "../models/user-model";
import * as jwt from "jsonwebtoken"
import "dotenv/config"
import HttpException from "../exceptions/http-exception";
import "dotenv/config"
import {IJwtService} from "../interfaces/IJwtService";
import {JsonWebTokenError, TokenExpiredError} from "jsonwebtoken";

/**
 * Service class for working with tokens of users
 * @copyright Serdar Durdyev
 */
@Injectable()
export class JwtService implements IJwtService {

    /**
     * Sign user and return token data
     * @param user User for signing
     */
    public signUser(user: IUser): string {
        const token = jwt.sign({
            email: user.email,
            id: user._id
        }, process.env.JWT_KEY as string, {expiresIn: process.env.JWT_EXPIRES, issuer: process.env.JWT_ISSUER});
        return token;
    }

    /**
     * Get user datt from token
     * @param token Bearer token from header
     */
    public async getUserFromToken(token: string): Promise<IUser> {
        try {
            const userData: any = await jwt.verify(token, process.env.JWT_KEY as string, {issuer: process.env.JWT_ISSUER})
            if (!userData.email || !userData.id) throw new HttpException(401, "Неверные параметры токена");
            const user = UserModel.findOne({$and: [{_id: userData.id, email: userData.email}]}).lean()
            return user;
        } catch (error) {
            if (error instanceof TokenExpiredError) throw new HttpException(400, "Срок действия токена истек");
            if (error instanceof JsonWebTokenError) throw new HttpException(400, "Ошибка сигнатуры токена");
            throw new HttpException(400, error.message || "Ошибка токена");
        }
    }

    /**
     * Parse user from HTTP header authorization
     * @param headerAuthorization HTTP  header with authorization
     */
    public async parseTokenFromHeader(headerAuthorization: string) {
        if (!headerAuthorization) throw  new HttpException(401, "Токен не указан");
        const splittedData = headerAuthorization.split(" ");
        if (splittedData.length < 2) throw  new HttpException(401, "Неверно указан токен");
        if (splittedData[0].toLowerCase() != "bearer") throw  new HttpException(401, "Неверно указан токен");
        const userData = await this.getUserFromToken(splittedData[1]);
        return userData;
    }
}