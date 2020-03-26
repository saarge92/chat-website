import mongoose, {Schema, Types} from "mongoose";

export const RoleSchema = new Schema({
    name: {required: true, unique: true, type: String},
    created_at: {required: true, type: Date, default: Date.now}
})

export interface IRole extends Document {
    _id: Types.ObjectId,
    created_at: Date,
    name: string
}

// @ts-ignore
export const RoleModel = mongoose.model<IRole>("roles", RoleSchema);