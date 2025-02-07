import {create} from "zustand";
import {
    EInventoryStatus,
    InventoryService,
    TInventoryItem,
    TInventoryTableItem
} from "../../../shared/api/inventory-service.ts";

type TUseInventoryStore = {
    inventory: TInventoryTableItem[];
    requestInventory: () => void;
    addInventoryItem: (model: { name: string; amount: number }) => Promise<void>;
    deleteInventoryItems: (ids: string[]) => Promise<void>;

    selectedInventoryItems: string[];
    setSelectedInventoryItems: (ids: string[]) => void;

    newInventoryItems: TInventoryItem[];
    getNewInventoryItems: (groupIds: string[]) => Promise<void>;

    usedInventoryItems: TInventoryItem[];
    getUsedInventoryItems: (groupIds: string[]) => Promise<void>;

    brokenInventoryItems: TInventoryItem[];
    getBrokenInventoryItems: (groupIds: string[]) => Promise<void>;

    updateItemsStatus: (ids: string[], status: EInventoryStatus) => Promise<void>;

    isShowAddDialog: boolean;
    setIsShowAddDialog: (isShowAddDialog: boolean) => void;

    isShowDeleteDialog: boolean;
    setIsShowDeleteDialog: (isShowDeleteDialog: boolean) => void;

    isShowReportDialog: boolean;
    setIsShowReportDialog: (isShowReportDialog: boolean) => void;

    inventoryTypes: string[]
    getInventoryTypes: () => Promise<void>;
};

export const useInventoryStore = create<TUseInventoryStore>((set, get) => ({
    inventory: [],
    requestInventory: async () => {
        const payload = await InventoryService.getInventory();
        set({inventory: payload});
    },
    addInventoryItem: async (model) => {
        await InventoryService.addInventoryItem(model);
        get().requestInventory();
    },
    deleteInventoryItems: async (ids) => {
        await InventoryService.deleteInventoryItem(ids);
        get().requestInventory();
    },

    selectedInventoryItems: [],
    setSelectedInventoryItems: (ids: string[]) => set({selectedInventoryItems: ids}),

    newInventoryItems: [],
    getNewInventoryItems: async (groupIds) => {
        const payload = await InventoryService.getGroupedInventoryByStatus(groupIds, EInventoryStatus.new);
        set({newInventoryItems: payload});
    },

    usedInventoryItems: [],
    getUsedInventoryItems: async (groupIds) => {
        const payload = await InventoryService.getGroupedInventoryByStatus(groupIds, EInventoryStatus.used);
        set({usedInventoryItems: payload});
    },

    brokenInventoryItems: [],
    getBrokenInventoryItems: async (groupIds) => {
        const payload = await InventoryService.getGroupedInventoryByStatus(groupIds, EInventoryStatus.broken);
        set({brokenInventoryItems: payload});
    },

    updateItemsStatus: async (ids, status) => {
        const {selectedInventoryItems, getNewInventoryItems, getUsedInventoryItems, getBrokenInventoryItems, requestInventory} = get();

        await InventoryService.updateItemsStatus(selectedInventoryItems, ids, status);


        getNewInventoryItems(selectedInventoryItems);
        getUsedInventoryItems(selectedInventoryItems);
        getBrokenInventoryItems(selectedInventoryItems);
        requestInventory();
    },

    isShowAddDialog: false,
    setIsShowAddDialog: (isShowAddDialog: boolean) => set({isShowAddDialog}),

    isShowDeleteDialog: false,
    setIsShowDeleteDialog: (isShowDeleteDialog: boolean) => set({isShowDeleteDialog}),

    isShowReportDialog: false,
    setIsShowReportDialog: (isShowReportDialog: boolean) => set({isShowReportDialog}),

    inventoryTypes: [],
    getInventoryTypes: async () => {
        const result = await InventoryService.getNames();
        set({inventoryTypes: result});
    },
}));