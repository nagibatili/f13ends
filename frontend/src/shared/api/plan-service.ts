import {planApi} from "./plan-api.ts";

export type TPlanItem = {
    _id: string;
    type: string;
    amount: number;
    price: number;
    supplier: string;
}

export class PlanService {
    static async getPlanItems() {
        return planApi.get<TPlanItem[]>("/").then(res => res.data);
    }

    static async addPlanItem(model: TPlanItem) {
        return planApi.post<void>("/", model).then(res => res.data);
    }

    static async deletePlanItem(ids: string[]) {
        return planApi.post<void>("/delete", {ids}).then(res => res.data);
    }

    static async donePlanItem(ids: string[]) {
        return planApi.post<void>("/done", {ids}).then(res => res.data);
    }
}