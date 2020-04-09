import mongoose, { Types, Schema } from "mongoose";
import { IUser } from "./user-model";
import { IInterest } from "./interest.model";

const RoomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    created_at: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date, required: true, default: Date.now },
    creator: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    interests: [{
        type: Schema.Types.ObjectId, ref: 'interests', required: false,
    }]
})

export interface IRoom extends Document {
    _id: Types.ObjectId,
    created_at: Date,
    name: string,
    updated_at: string,
    creator: IUser,
    interests: Array<IInterest>
}

// @ts-ignore
export const RoomModel = mongoose.model<IRoom>("rooms", RoomSchema);