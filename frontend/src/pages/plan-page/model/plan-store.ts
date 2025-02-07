import {create} from "zustand";
import {PlanService, TPlanItem} from "../../../shared/api/plan-service.ts";

type TUsePlanStore = {
    planItems: TPlanItem[];
    getPlanItems: () => Promise<void>;
    addPlanItem: (model: TPlanItem) => Promise<void>;
    deletePlanItems: (ids: string[]) => Promise<void>;
    donePlanItem: (ids: string[]) => Promise<void>;
};

export const usePlanStore = create<TUsePlanStore>(
    (set, get) => ({
        planItems: [],
        getPlanItems: async () => {
            const result = await PlanService.getPlanItems();
            set({planItems: result});
        },
        addPlanItem: async (model) => {
            await PlanService.addPlanItem(model);
            get().getPlanItems();
        },
        deletePlanItems: async (ids) => {
            await PlanService.deletePlanItem(ids);
            get().getPlanItems();
        },
        donePlanItem: async (ids) => {
            await PlanService.donePlanItem(ids);
            get().getPlanItems();
        },
    })
);