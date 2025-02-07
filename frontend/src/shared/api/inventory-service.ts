import {inventoryApi} from "./inventory-api.ts";

export enum EInventoryStatus {
    new = 'Новый',
    used = 'Используется',
    broken = 'Сломан',
}

export type TInventoryItem = {
    _id: string;
    serialNumber: string;
    name: string;
    ownerUsername?: string;
    status: EInventoryStatus;
    assignedTo?: string;
}

export type TInventoryGroup = {
    _id: string;
    name: string;

    items: TInventoryItem[]
}

export type TInventoryTableItem = {
    _id: string;
    name: string;
    used: number;
    new: number;
    broken: number;
    total: number;
};

export class InventoryService {
    static async getInventory() {
        return inventoryApi.get<TInventoryTableItem[]>("/").then(res => res.data);
    }
    static async getUserInventory(userId: string) {
        return inventoryApi.get<TInventoryItem[]>(`/user/${userId}`).then(res => res.data);
    }
    static getNewInventoryByName(name: string) {
        return inventoryApi.get<TInventoryItem[]>(`/getByName/${name}`).then(res => res.data);
    }

    static async addInventoryItem(model: {
        name: string;
        amount: number;
    }) {
        return inventoryApi.post<void>("/add", {name: model.name, amount: model.amount}).then(res => res.data);
    }

    static async deleteInventoryItem(ids: string[]) {
        return inventoryApi.post<void>("/delete", {ids}).then(res => res.data);
    }

    static async getGroupedInventoryByStatus(groupIds: string[], status: EInventoryStatus) {
        return inventoryApi.post<TInventoryItem[]>("/getGroupInventoryByStatus", {
            groupIds,
            status
        }).then(res => res.data);
    }

    static async updateItemsStatus(inventoryGroupIds: string[],
                                   itemIds: string[],
                                   newStatus: EInventoryStatus) {
        return inventoryApi.post<void>("/updateItemsStatus", {inventoryGroupIds, itemIds, newStatus}).then(res => res.data);
    }

    static async getNames() {
        return inventoryApi.get<string[]>("/getNames").then(res => res.data);
    }
}