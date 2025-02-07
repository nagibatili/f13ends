import axios from "axios";

export const planApi = axios.create({
    baseURL: 'http://localhost:3000/api/plan',
});