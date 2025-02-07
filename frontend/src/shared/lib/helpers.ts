import {inventoryApi} from "../api/inventory-api.ts";
import {userApi} from "../api/user-api.ts";
import {planApi} from "../api/plan-api.ts";
import {requestApi} from "../api/request-api.ts";

export const setAutorizationHeaderInAPIs = (token: string) => {
    inventoryApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    userApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    planApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    requestApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};