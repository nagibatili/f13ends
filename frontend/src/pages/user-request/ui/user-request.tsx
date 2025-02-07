import {ChangeEventHandler, FC, useEffect, useState} from "react";
import {Navbar} from "../../../widgets/navbar/ui/navbar.tsx";
import { Page } from "../../../shared/ui/page/page.tsx";
import AutoSizer from "react-virtualized-auto-sizer";
import Grid from "@mui/material/Grid2";
import {ToolbaredTable} from "../../../shared/ui/toolbared-table/toolbared-table.tsx";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    Autocomplete,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    TextField,
    useTheme
} from "@mui/material";
import Button from "@mui/material/Button";
import { useUserRequestStore } from "../model/user-request-store.ts";
import {useAppStore} from "../../../shared/model/app-store.ts";
import {useInventoryStore} from "../../inventory-page/model/inventory-store.ts";
import {ERequestStatus, TRequest} from "../../../shared/api/request-service.ts";

export const UserRequestPage: FC = () => {

    const userId = useAppStore(state => state.userId);
    const username = useAppStore(state => state.username);

    const requests = useUserRequestStore(state => state.requests);
    const getUserRequests = useUserRequestStore(state => state.getUserRequests);

    const isShowAddDialog = useUserRequestStore(state => state.isShowAddDialog);
    const setIsShowAddDialog = useUserRequestStore(state => state.setIsShowAddDialog);

    const isShowDeleteDialog = useUserRequestStore(state => state.isShowDeleteDialog);
    const setIsShowDeleteDialog = useUserRequestStore(state => state.setIsShowDeleteDialog);

    const selectedRequests = useUserRequestStore(state => state.selectedRequests);
    const setSelectedRequests = useUserRequestStore(state => state.setSelectedRequests);

    const addRequest = useUserRequestStore(state => state.addRequest);
    const deleteRequest = useUserRequestStore(state => state.deleteRequest);

    const inventoryTypes = useInventoryStore(state => state.inventoryTypes);
    const getInventoryTypes = useInventoryStore(state => state.getInventoryTypes);

    const theme = useTheme();

    useEffect(() => {
        getUserRequests(userId);
        getInventoryTypes();
    }, [getUserRequests, userId, getInventoryTypes]);

    const [addFields, setAddFields] = useState<Omit<TRequest, '_id' | 'applicantId' | 'status' | 'applicantUsername'>>(() => ({
        type: '',
        amount: 0,
    }));

    const onChangeField: ChangeEventHandler<HTMLInputElement> = (e) => setAddFields({
        ...addFields,
        [e.target.name]: e.target.value
    });

    return (
        <Page navbar={<Navbar/>}>
            <AutoSizer disableWidth>
                {({height}) => (
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <ToolbaredTable
                                title='Мои заявки'
                                buttons={[
                                    {
                                        icon: <AddIcon/>,
                                        tooltipTitle: 'Добавить',
                                        onClick: () => setIsShowAddDialog(true)
                                    },
                                    {
                                        icon: <DeleteIcon/>,
                                        tooltipTitle: 'Удалить',
                                        onClick: () => setIsShowDeleteDialog(true),
                                        disabled: !selectedRequests.length
                                    },
                                ]}
                                selected={selectedRequests}
                                setSelected={setSelectedRequests}
                                size='medium'
                                maxHeight={height}
                                rows={requests}
                                getItemId={(item) => item._id}
                                columns={[
                                    {header: "Тип", getValue: (item) => String(item.type)},
                                    {header: "Кол-во", getValue: (item) => String(item.amount)},
                                    {header: "Статус", getValue: (item) => String(item.status)},
                                ]}
                                clickable
                                isShowCheckboxes
                            />

                        </Grid>
                    </Grid>
                )}
            </AutoSizer>

            <Dialog open={isShowAddDialog} onClose={() => setIsShowAddDialog(false)} fullWidth>
                <DialogTitle>Создать заявку</DialogTitle>
                <Divider />
                <DialogContent style={{
                    display: 'flex',
                    gap: theme.spacing(2),
                    flexDirection: 'column',
                    padding: theme.spacing(2)
                }}>
                    <Autocomplete
                        disablePortal
                        options={inventoryTypes}
                        getOptionLabel={(option) => option}
                        fullWidth
                        onChange={(_, value) => setAddFields({...addFields, type: value || ''})}
                        renderInput={
                            (params) =>
                                <TextField
                                    {...params}
                                    label="Тип"
                                    value={addFields.type}
                                    name='type'
                                    onChange={onChangeField}
                                />
                        }
                    />
                    <TextField
                        fullWidth
                        label='Кол-во'
                        type="number"
                        value={addFields.amount}
                        name='amount'
                        onChange={onChangeField}
                    />
                </DialogContent>
                <Divider />
                <DialogActions color='secondary'>
                    <Button variant={"contained"} color={"primary"} onClick={() => {
                        addRequest({
                            amount: addFields.amount,
                            type: addFields.type,
                            applicantId: userId,
                            applicantUsername: username,
                            status: ERequestStatus.pending
                        } as TRequest);
                        setIsShowAddDialog(false)
                    }}>Добавить</Button>
                    <Button onClick={() => setIsShowAddDialog(false)}>Отмена</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isShowDeleteDialog} onClose={() => setIsShowDeleteDialog(false)}>
                <DialogTitle>Удалить заявку?</DialogTitle>
                <DialogActions color='secondary'>
                    <Button onClick={() => {
                        deleteRequest(selectedRequests, userId);
                        setSelectedRequests([]);
                        setIsShowDeleteDialog(false);
                    }}>Удалить</Button>
                    <Button onClick={() => setIsShowDeleteDialog(false)}>Отмена</Button>
                </DialogActions>
            </Dialog>
        </Page>
    )
}