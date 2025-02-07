import {create} from "zustand";
import {TRequest, RequestService} from "../../../shared/api/request-service.ts";

type TUseUserRequestStore = {
    requests: TRequest[],
    getUserRequests: (userId: string) => Promise<void>,
    addRequest: (model: TRequest) => Promise<void>,
    deleteRequest: (ids: string[], userId: string) => Promise<void>,

    selectedRequests: string[],
    setSelectedRequests: (ids: string[]) => void,

    isShowAddDialog: boolean,
    setIsShowAddDialog: (isShowAddDialog: boolean) => void,
    isShowDeleteDialog: boolean,
    setIsShowDeleteDialog: (isShowDeleteDialog: boolean) => void
};

export const useUserRequestStore = create<TUseUserRequestStore>(
    (set, get) => ({
            requests: [],
            getUserRequests: (userId: string) => RequestService.getUserRequests(userId).then(res => set({requests: res})),
            addRequest: (model: TRequest) => RequestService.addRequest(model).then(() => get().getUserRequests(model.applicantId)),
            deleteRequest: (ids: string[], userId: string) => RequestService.deleteRequest(ids).then(() => get().getUserRequests(userId)),

            selectedRequests: [],
            setSelectedRequests: (ids: string[]) => set({selectedRequests: ids}),

            isShowAddDialog: false,
            setIsShowAddDialog: (isShowAddDialog: boolean) => set({isShowAddDialog}),
            isShowDeleteDialog: false,
            setIsShowDeleteDialog: (isShowDeleteDialog: boolean) => set({isShowDeleteDialog})
        }
    )
);