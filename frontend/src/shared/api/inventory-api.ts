import axios from "axios";

export const inventoryApi = axios.create({
    baseURL: 'http://localhost:3000/api/inventory',
});