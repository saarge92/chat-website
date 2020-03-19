import {Injectable} from "@decorators/di";
import {IUser} from "../models/user-model";
import * as jwt from "jsonwebtoken"
import "dotenv/config"

/**
 * Service class for working with tokens of users
 * @copyright Serdar Durdyev
 */
@Injectable()
export class JwtService {

    /**
     * Sign user and return token data
     * @param user User for signing
     */
    public signUser(user: IUser): string {
        const token = jwt.sign({
            email: user.email,
            id: user._id
        }, process.env.JWT_KEY as string, {expiresIn: process.env.EXPIRES, issuer: process.env.ISSUER});
        return token;
    }
}