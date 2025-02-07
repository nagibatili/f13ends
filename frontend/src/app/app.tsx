import {Route, Routes, useNavigate} from "react-router-dom";
import {ERoutes} from "../shared/lib/constants";
import {LoginPage} from "../pages/login-page";
import {RegisterPage} from "../pages/register-page";
import {InventoryPage} from "../pages/inventory-page";
import Box from "@mui/material/Box";
import {useAppStore} from "../shared/model/app-store.ts";
import {useEffect} from "react";
import {PlanPage} from "../pages/plan-page";
import {UserInventoryPage} from "../pages/user-inventory";
import {UserRequestPage} from "../pages/user-request";
import {RequestPage} from "../pages/request";

export const App = () => {

    const navigate = useNavigate();

    const isAuth = useAppStore(state => state.isAuth);
    const userRole = useAppStore(state => state.userRole);

    useEffect(() => {
        if (!isAuth && window.location.pathname !== ERoutes.login && window.location.pathname !== ERoutes.register) {
            navigate(ERoutes.login);
        }
    }, [isAuth, navigate]);

    const renderAdminRoutes = (
        <>
            <Route
                path={ERoutes.inventory}
                element={<InventoryPage/>}
            />

            <Route
                path={ERoutes.plan}
                element={<PlanPage/>}
            />
            <Route
                path={ERoutes.request}
                element={<RequestPage/>}
            />
        </>
    );

    const userRoutes = (
        <>
            <Route
                path={ERoutes.inventory}
                element={<InventoryPage/>}
            />
            <Route
                path={ERoutes.userInventory}
                element={<UserInventoryPage/>}
            />
            <Route
                path={ERoutes.userRequest}
                element={<UserRequestPage/>}
            />
        </>
    );

    return (
        <Box style={{height: "100vh"}}>
            <Routes>
                <Route path={ERoutes.login} element={<LoginPage/>}/>
                <Route
                    path={ERoutes.register}
                    element={<RegisterPage/>}
                />
                {userRole === 'admin' && renderAdminRoutes}
                {userRole === 'user' && userRoutes}
            </Routes>
        </Box>
    );
};
