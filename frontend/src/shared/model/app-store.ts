import {create} from "zustand";
import {EUserRole, UserService} from "../api/user-service.ts";
import {setAutorizationHeaderInAPIs} from "../lib/helpers.ts";

type TUseAppStore = {
    isAuth: boolean;
    setIsAuth: (isAuth: boolean) => void;

    username: string;
    userRole: EUserRole;
    userId: string;

    refreshToken: string;
    accessToken: string;

    login: (username: string, password: string) => Promise<{
        accessToken: string;
        refreshToken: string;
        username: string;
        userRole: EUserRole;
        userId: string;
    } | undefined>;
    logout: () => Promise<void>;

    refresh: () => Promise<void>;

    register: (username: string, password: string) => Promise<void>;
}

export const useAppStore = create<TUseAppStore>((set, get) => ({
    isAuth: false,
    setIsAuth: (isAuth: boolean) => set({isAuth}),

    username: '',
    userRole: EUserRole.user,
    userId: '',

    refreshToken: '',
    accessToken: '',

    login: async (username: string, password: string) => {
        const result = await UserService.login(username, password);
        if (!result) {
            return;
        }
        set({
            username: result.username,
            userRole: result.userRole,
            userId: result.userId,
            isAuth: true,
            refreshToken: result.refreshToken,
            accessToken: result.accessToken
        });

        setAutorizationHeaderInAPIs(result.accessToken);

        return result;
    },
    logout: async () => {
        await UserService.logout(get().refreshToken);
        set({refreshToken: '', accessToken: '', isAuth: false, username: ''});

        setAutorizationHeaderInAPIs('');
    },
    refresh: async () => {
        const result = await UserService.refresh(get().refreshToken);
        set({accessToken: result.accessToken});

        setAutorizationHeaderInAPIs(result.accessToken);
    },

    register: async (username: string, password: string) => {
        await UserService.register(username, password);
    },
}));