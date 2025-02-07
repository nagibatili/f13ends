import {requestApi} from "./request-api.ts";

export enum ERequestStatus {
    pending = 'Отправлена',
    approved = 'Одобрена',
    rejected = 'Отклонена',
}

export type TRequest = {
    _id: string;
    type: string;
    amount: number;
    applicantId: string;
    applicantUsername: string;
    status: ERequestStatus;
};

export class RequestService {
    static async getRequests() {
        return requestApi.get<TRequest[]>('/').then(res => res.data);
    }
    static getUserRequests(userId: string) {
        return requestApi.get<TRequest[]>(`/user-requests/${userId}`).then(res => res.data);
    }
    static async addRequest(model: TRequest) {
        return requestApi.post<void>('/', model).then(res => res.data);
    }
    static async deleteRequest(ids: string[]) {
        return requestApi.post<void>('/delete', {ids}).then(res => res.data);
    }
    static async approveRequest(id: string) {
        return requestApi.post<void>('/approve', {id}).then(res => res.data);
    }
    static async rejectRequest(id: string) {
        return requestApi.post<void>('/reject', {id}).then(res => res.data);
    }
}