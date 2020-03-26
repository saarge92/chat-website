import {Injectable} from "@decorators/di";
import {IUser, UserModel} from "../models/user-model";
import {IRoom} from "../models/room.model";
import {CreateInterestDto} from "../dto/create-interest-dto";
import {IInterest, InterestModel} from "../models/interest.model";

@Injectable()
export class InterestService {
    // tslint:disable-next-line:ban-types
    public async hasPermissionForRoom(user: String | IUser, room: IRoom): Promise<boolean> {
        if (typeof (user) == "string") {

        } else {

            return true;
        }
        return false;
    }

    public async createInterest(interestDto: CreateInterestDto) {
        const newInterest = await InterestModel.create({
            name: interestDto.name
        });
        return newInterest;
    }
}