import {TRequest, RequestService} from "../../../shared/api/request-service.ts";
import {create} from "zustand";
import {InventoryService, TInventoryItem} from "../../../shared/api/inventory-service.ts";

type TUseRequestStore = {
    requests: TRequest[],
    getRequests: () => Promise<void>,
    approveRequest: () => Promise<void>,
    rejectRequest: (id: string) => Promise<void>,
    deleteRequest: (id: string) => Promise<void>,

    selectedRequestId: string;
    setSelectedRequestId: (id: string) => void

    isShowApproveDialog: boolean,
    setIsShowApproveDialog: (isShowApproveDialog: boolean) => void

    isShowDeleteDialog: boolean,
    setIsShowDeleteDialog: (isShowDeleteDialog: boolean) => void

    availableInventory: TInventoryItem[];
    getAvailableInventory: (name: string) => Promise<void>
}

export const useRequestStore = create<TUseRequestStore>(
    (set, get) => ({
        requests: [],
        getRequests: () => RequestService.getRequests().then(res => set({requests: res})),
        approveRequest: () => RequestService.approveRequest(get().selectedRequestId).then(() => get().getRequests()),
        rejectRequest: (id: string) => RequestService.rejectRequest(id).then(() => get().getRequests()),
        deleteRequest: (id: string) => RequestService.deleteRequest([id]).then(() => get().getRequests()),

        selectedRequestId: '',
        setSelectedRequestId: (id: string) => set({selectedRequestId: id}),

        isShowApproveDialog: false,
        setIsShowApproveDialog: (isShowApproveDialog: boolean) => set({isShowApproveDialog}),

        isShowDeleteDialog: false,
        setIsShowDeleteDialog: (isShowDeleteDialog: boolean) => set({isShowDeleteDialog}),

        availableInventory: [],
        getAvailableInventory: (name) => InventoryService.getNewInventoryByName(name).then(res => set({availableInventory: res}))
    })
);