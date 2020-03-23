import mongoose, {Types} from "mongoose";

const RoomSchema = new mongoose.Schema({
    name: {type: String, required: true},
    created_at: {type: Date, required: true, default: Date.now},
    updated_at: {type: Date, required: true, default: Date.now},
    creator: {type: String, required: true},
    interests: [{
        type: String
    }]
})

export interface IRoom extends Document {
    _id: Types.ObjectId,
    created_at: Date,
    name: string,
    updated_at: string,
    creator: string,
    interests: Array<string>
}

// @ts-ignore
export const RoomModel = mongoose.model<IRoom>("rooms", RoomSchema);