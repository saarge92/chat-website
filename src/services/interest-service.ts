import { Injectable } from "@decorators/di";
import { IUser, UserModel } from "../models/user-model";
import { IRoom } from "../models/room.model";
import { CreateInterestDto } from "../dto/create-interest-dto";
import { InterestModel } from "../models/interest.model";
import { Types } from "mongoose";


/**
 * Service class for working with business logic of interests
 * @copyright Serdar Durdyev
 */
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

    /**
     * Create interest in database
     * @param interestDto
     */
    public async createInterest(interestDto: CreateInterestDto, userId: Types.ObjectId) {
        const newInterest = await InterestModel.create({
            name: interestDto.name,
            creator: userId
        });
        return newInterest;
    }

    /**
     * Add interest to users's interest
     * This function might be need for first time creation interest in the database
     * @param userId User for update his interest
     * @param interestId InterestIdForCreation
     */
    public async addUserToInterest(userId: string, interestId: string) {
        await UserModel.updateOne({ _id: userId }, { $push: { interests: Types.ObjectId(interestId) } })
    }

    /**
     * Try assign user to interest
     * @param userId User id for assigning
     * @param interestId Id of interest
     */
    public async tryAssignInterestForUser(userId: string, interestId: string): Promise<boolean> {
        const user: IUser = await UserModel.findOne({ _id: userId }).populate("interests").exec();
        if (!user) return false;

        const intersectedUser = user.interests.filter((interest) => interest._id == interestId);
        if (intersectedUser.length <= 0) {
            const isUpdatedInfo = await UserModel.updateOne({ _id: userId }, { $push: { interests: Types.ObjectId(interestId) } })
            return isUpdatedInfo.n > 0;
        }

        return false;
    }

    /**
     * Get all interests paginated by perPage & current Page
     * @param perPage Count interests in 1 page
     * @param currentPage Current page for review
     */
    public async getInterests(perPage: number = 12, currentPage: number = 1) {
        let allInterests = await InterestModel.find()
            .skip((currentPage - 1) * perPage).limit(parseInt(perPage.toString())).sort({ created_at: -1 });
        allInterests = allInterests.map(interest => {
            return {
                id: interest._id,
                name: interest.name,
                created_at: interest.created_at,
                creator: interest.creator
            }
        })
        return allInterests;
    }
}