import {userApi} from "./user-api.ts";

export enum EUserRole {
    admin = 'admin',
    user = 'user',
}

export class UserService {
    static async login(username: string, password: string) {
        return userApi.post<{
            accessToken: string,
            refreshToken: string,
            username: string,
            userRole: EUserRole,
            userId: string
        }>('/login', {username, password}).then(res => res.data);
    }

    static async logout(refreshToken: string) {
        return userApi.post('/logout', {refreshToken}).then(res => res.data);
    }

    static async register(username: string, password: string) {
        return userApi.post('/register', {username, password, role: EUserRole.user}).then(res => res.data);
    }

    static async refresh(refreshToken: string) {
        return userApi.post<{
            accessToken: string,
        }>('/refresh-token', {refreshToken}).then(res => res.data);
    }
}