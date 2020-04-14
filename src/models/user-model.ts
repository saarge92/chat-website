import mongoose, {Schema, Types} from "mongoose";
import {IRole} from "./roles-model";
import {IInterest} from "./interest.model";

const UserSchema: Schema = new Schema<any>({
    email: {required: true, unique: true, type: String},
    created_at: {required: true, type: Date, default: Date.now},
    password: {required: true, type: String},
    updated_at: {required: true, type: Date, default: Date.now},
    roles: [{
        type: Schema.Types.ObjectId, ref: "roles", required: false
    }],
    interests: [{
        type: Schema.Types.ObjectId, ref: "interests", required: false
    }]
});

export interface IUser extends Document {
    email: string;
    created_at: Date,
    password: string,
    updated_at: Date,
    _id: string,
    roles: Array<Types.ObjectId>,
    interests: Array<IInterest>
}

// @ts-ignore
export const UserModel = mongoose.model<IUser>("users", UserSchema);