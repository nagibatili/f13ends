import mongoose, {Schema} from "mongoose";

export enum ERequestStatus {
    pending = 'Отправлена',
    approved = 'Одобрена',
    rejected = 'Отклонена',
}

export interface IRequest {
    type: string;
    amount: number;
    applicantId: Schema.Types.ObjectId;
    applicantUsername: string;
    status: ERequestStatus;
}

const requestSchema = new Schema<IRequest>({
    type: {type: String, required: true},
    amount: {type: Number, required: true},
    applicantId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    applicantUsername: {type: String, required: true},
    status: {type: String, required: true},
}, {timestamps: true});

export const RequestModel = mongoose.model<IRequest>('request', requestSchema);