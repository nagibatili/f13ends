import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import {FC, MouseEventHandler, useState} from "react";
import {ERoutes} from "../../../shared/lib/constants.ts";
import {useNavigate, useLocation} from "react-router-dom";
import {AccountCircle} from "@mui/icons-material";
import {useAppStore} from "../../../shared/model/app-store.ts";
import {useTheme} from "@mui/material";
import {EUserRole} from "../../../shared/api/user-service.ts";

export const Navbar: FC = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const logout = useAppStore(state => state.logout);
    const username = useAppStore(state => state.username);
    const userRole = useAppStore(state => state.userRole);

    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu: MouseEventHandler<HTMLElement> = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const renderAdminMenu = () => {
        return (
            <>
                <Button
                    onClick={() => navigate(ERoutes.inventory)}
                    color="secondary"
                    variant={location.pathname === ERoutes.inventory ? "outlined" : "text"}
                >
                    Инвентарь
                </Button>
                <Button
                    onClick={() => navigate(ERoutes.plan)}
                    color="secondary"
                    variant={location.pathname === ERoutes.plan ? "outlined" : "text"}
                >
                    План
                </Button>
                <Button
                    onClick={() => navigate(ERoutes.request)}
                    color="secondary"
                    variant={location.pathname === ERoutes.request ? "outlined" : "text"}
                >
                    Заявки
                </Button>
            </>
        )
    }

    const renderUserMenu = () => {
        return (
            <>
                <Button
                    onClick={() => navigate(ERoutes.inventory)}
                    color="secondary"
                    variant={location.pathname === ERoutes.inventory ? "outlined" : "text"}
                >
                    Инвентарь
                </Button>
                <Button
                    onClick={() => navigate(ERoutes.userInventory)}
                    color="secondary"
                    variant={location.pathname === ERoutes.userInventory ? "outlined" : "text"}
                >
                    Мой инвентарь
                </Button>
                <Button
                    onClick={() => navigate(ERoutes.userRequest)}
                    color="secondary"
                    variant={location.pathname === ERoutes.userRequest ? "outlined" : "text"}
                >
                    Заявки
                </Button>
            </>
        )
    }

    return (
        <AppBar position="sticky">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{flexGrow: 1, display: 'flex', gap: theme.spacing(2)}}>
                        {userRole === EUserRole.admin && renderAdminMenu()}
                        {userRole === EUserRole.user && renderUserMenu()}
                    </Box>
                    <Box sx={{flexGrow: 0}}>
                        <Button color="secondary" variant="outlined" onClick={handleOpenUserMenu}
                                startIcon={<AccountCircle/>}>
                            {username}
                        </Button>
                        <Menu
                            sx={{mt: '45px'}}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={() => {
                                handleCloseUserMenu();
                                logout();
                            }}>
                                <Typography sx={{textAlign: 'center'}}>Выйти</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};