import mongoose, {Schema} from "mongoose";

export interface IPlanItem {
    type: string;
    amount: number;
    price: number;
    supplier: string;
}

const planItemSchema = new Schema<IPlanItem>({
    type: {type: String, required: true},
    amount: {type: Number, required: true},
    price: {type: Number, required: true},
    supplier: {type: String, required: true},
}, {timestamps: true});

export const PlanItemModel = mongoose.model<IPlanItem>('PlanItem', planItemSchema);