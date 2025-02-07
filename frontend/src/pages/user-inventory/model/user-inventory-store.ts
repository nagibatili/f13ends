import {create} from "zustand";
import {InventoryService, TInventoryItem} from "../../../shared/api/inventory-service.ts";

type TUseUserInventoryStore = {
    inventory: TInventoryItem[];
    getUserInventory: (userId: string) => Promise<void>;
};

export const useUserInventoryStore = create<TUseUserInventoryStore>(
    (set) => ({
            inventory: [],
            getUserInventory: async (userId: string) => {
                const res = await InventoryService.getUserInventory(userId);
                set({inventory: res});
            },
        }
    )
);