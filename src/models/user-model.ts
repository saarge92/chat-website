import mongoose, {Schema} from "mongoose";

const UserSchema: Schema = new Schema<any>({
    email: {required: true, unique: true, type: String},
    created_at: {required: true, type: Date, default: Date.now},
    password: {required: true, type: String},
    updated_at: {required: true, type: Date, default: Date.now}
});

export interface IUser extends Document {
    email: string;
    created_at: Date,
    password: string,
    updated_at: Date
}

// @ts-ignore
export const UserModel = mongoose.model<IUser>('users', UserSchema);