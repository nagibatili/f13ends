import {Page} from "../../../shared/ui/page/page.tsx";
import {FC, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAppStore} from "../../../shared/model/app-store.ts";
import {ERoutes} from "../../../shared/lib/constants.ts";
import image from "../../../shared/assets/login-background.jpg";
import {Box, Stack, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export const RegisterPage: FC = () => {
    const [loginText, setLoginText] = useState('');
    const [passwordText, setPasswordText] = useState('');
    const [confirmPasswordText, setConfirmPasswordText] = useState('');
    const navigate = useNavigate();

    const register = useAppStore(state => state.register);

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
                                    autoComplete: 'off',
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
                                    autoComplete: 'new-password',
                                }
                            }}
                        />
                        <TextField
                            label="Подтвердите пароль"
                            placeholder="Введите пароль"
                            type="password"
                            value={confirmPasswordText}
                            onChange={(ev) => setConfirmPasswordText(ev.target.value)}
                            slotProps={{
                                input: {
                                    autoComplete: 'new-password',
                                }
                            }}
                        />
                    </Box>
                    <Box>
                        <Button onClick={() => {
                            if (passwordText !== confirmPasswordText) return alert('Пароли не совпадают!');

                            register(loginText, passwordText);
                            navigate(ERoutes.login);
                        }}>Зарегистрироваться</Button>
                        <Button color="primary" onClick={() => navigate(ERoutes.login)}>Назад</Button>
                    </Box>
                </Stack>
            </Stack>
        </Page>
    );
}