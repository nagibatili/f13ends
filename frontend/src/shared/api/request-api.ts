import axios from "axios";

export const requestApi = axios.create({
    baseURL: 'http://localhost:3000/api/request',
});
