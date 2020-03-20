import mongoose, {Schema, Types} from "mongoose";

export const MessageSchema = new Schema({
    sender: {required: true, type: String},
    reciever: {required: true, type: String, default: Date.now},
    message: {required: true, type: String},
    created: {required: true, type: Date, default: Date.now}
})

export interface IMessage extends Document {
    _id: Types.ObjectId,
    created_at: Date,
    reciever: string,
    sender: string,
    message: string
}

// @ts-ignore
export const MessageModel = mongoose.model<IMessage>("messages", MessageSchema);