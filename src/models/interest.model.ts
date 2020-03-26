import mongoose, {Types} from "mongoose";

const InterestSchema = new mongoose.Schema({
    name: {type: String, required: true},
    created_at: {type: Date, required: true, default: Date.now},
})

export interface IInterest extends Document {
    _id: string,
    name: string
}

// @ts-ignore
export const InterestModel = mongoose.model<IInterest>("interests", InterestSchema);
