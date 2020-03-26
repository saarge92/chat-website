import mongoose, {Schema, Types} from "mongoose";
import {IUser} from "./user-model";

export const MessageSchema = new Schema({
    sender: {required: true, type: Schema.Types.ObjectId, ref: "users"},
    reciever: {required: true, type: Schema.Types.ObjectId, ref: "users"},
    message: {required: true, type: String},
    created: {required: true, type: Date, default: Date.now}
})

export interface IMessage extends Document {
    _id: Types.ObjectId,
    created_at: Date,
    reciever: IUser,
    sender: IUser,
    message: string
}

// @ts-ignore
export const MessageModel = mongoose.model<IMessage>("messages", MessageSchema);