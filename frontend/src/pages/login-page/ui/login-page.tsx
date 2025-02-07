import {Page} from "../../../shared/ui/page/page.tsx";
import {useState} from "react";
import Button from "@mui/material/Button";
import {Box, Stack, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useAppStore} from "../../../shared/model/app-store.ts";
import image from "../../../shared/assets/login-background.jpg";
import {useNavigate} from "react-router-dom";
import {ERoutes} from "../../../shared/lib/constants.ts";
import {EUserRole} from "../../../shared/api/user-service.ts";

export const LoginPage = () => {

    const [loginText, setLoginText] = useState('');
    const [passwordText, setPasswordText] = useState('');
    const navigate = useNavigate();

    const login = useAppStore(state => state.login);

    const handleLogin = async () => {
        const result = await login(loginText, passwordText);

        if (!result) return;

        if (result.userRole === EUserRole.admin) {
            navigate(ERoutes.inventory);
        }

        if (result.userRole === EUserRole.user) {
            navigate(ERoutes.userInventory);
        }
    }

    return (
        <Page style={{height: '100%', display: 'flex', background: `center / cover url(${image})`}}>
            <Stack direction={"row"} style={{height: '100%'}}>
                <Stack spacing={8} style={{flex: '0 0 50%', height: '100%'}} justifyContent={"center"}
                       alignItems={"center"}>
                    <Typography variant="h4" component="div" gutterBottom textAlign={"center"}>
                        УПРАВЛЕНИЕ СПОРТИВНЫМ ИНВЕТАРЁМ
                    </Typography>
                    <Box style={{display: 'flex', flexDirection: 'column', gap: '16px', width: 320}}>
                        <TextField
                            label="Логин"
                            placeholder="Введите логин"
                            value={loginText}
                            onChange={(ev) => setLoginText(ev.target.value)}
                            slotProps={{
                                input: {
                                    autoComplete: 'username',
                                }
                            }}

                        />
                        <TextField
                            label="Пароль"
                            placeholder="Введите пароль"
                            type="password"
                            value={passwordText}
                            onChange={(ev) => setPasswordText(ev.target.value)}
                            slotProps={{
                                input: {
                                    autoComplete: 'current-password',
                                }
                            }}
                        />
                    </Box>
                    <Box>
                        <Button color="primary" onClick={handleLogin}>Вход</Button>
                        <Button onClick={() => navigate(ERoutes.register)}>Регистрация</Button>
                    </Box>
                </Stack>
            </Stack>
        </Page>
    );
};
