import {IUser} from "../models/user-model";

export interface IJwtService {
    signUser(user: IUser): string;

    getUserFromToken(token: string): Promise<IUser>;

    parseTokenFromHeader(headerAuthorization: string);
}