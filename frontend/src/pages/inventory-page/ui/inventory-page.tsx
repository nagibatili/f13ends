import {FC, useEffect, useState} from "react";
import Grid from '@mui/material/Grid2';
import AutoSizer from "react-virtualized-auto-sizer";
import {Page} from "../../../shared/ui/page/page.tsx";
import {ToolbaredTable} from "../../../shared/ui/toolbared-table/toolbared-table.tsx";
import {Navbar} from "../../../widgets/navbar/ui/navbar.tsx";
import {useInventoryStore} from "../model/inventory-store.ts";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptIcon from "@mui/icons-material/Receipt";
import {InventoryCard} from "./inventory-card.tsx";
import {Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField, useTheme} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {BaseTable} from "../../../shared/ui/base-table/base-table.tsx";
import Box from "@mui/material/Box";
import {useAppStore} from "../../../shared/model/app-store.ts";
import {EUserRole} from "../../../shared/api/user-service.ts";

export const InventoryPage: FC = () => {

    const theme = useTheme();

    const userRole = useAppStore(state => state.userRole);
    const isAdmin = userRole === EUserRole.admin;

    const inventory = useInventoryStore(state => state.inventory);
    const requestInventory = useInventoryStore(state => state.requestInventory);
    const addInventoryItem = useInventoryStore(state => state.addInventoryItem);

    useEffect(() => {
        requestInventory();
    }, [requestInventory]);

    const selectedInventoryItems = useInventoryStore(state => state.selectedInventoryItems);
    const setSelectedInventoryItems = useInventoryStore(state => state.setSelectedInventoryItems);

    const isShowAddDialog = useInventoryStore(state => state.isShowAddDialog);
    const setIsShowAddDialog = useInventoryStore(state => state.setIsShowAddDialog);

    const [newItemName, setNewItemName] = useState('');
    const [newItemAmount, setNewItemAmount] = useState(0);

    const isShowDeleteDialog = useInventoryStore(state => state.isShowDeleteDialog);
    const setIsShowDeleteDialog = useInventoryStore(state => state.setIsShowDeleteDialog);
    const deleteInventoryItems = useInventoryStore(state => state.deleteInventoryItems);

    const isShowReportDialog = useInventoryStore(state => state.isShowReportDialog);
    const setIsShowReportDialog = useInventoryStore(state => state.setIsShowReportDialog);

    const newInventoryItems = useInventoryStore(state => state.newInventoryItems);
    const getNewInventoryItems = useInventoryStore(state => state.getNewInventoryItems);

    const usedInventoryItems = useInventoryStore(state => state.usedInventoryItems);
    const getUsedInventoryItems = useInventoryStore(state => state.getUsedInventoryItems);

    const brokenInventoryItems = useInventoryStore(state => state.brokenInventoryItems);
    const getBrokenInventoryItems = useInventoryStore(state => state.getBrokenInventoryItems);

    useEffect(() => {
        if (isShowReportDialog) {
            const allItemIds = inventory.map(item => item._id);
            getNewInventoryItems(allItemIds);
            getUsedInventoryItems(allItemIds);
            getBrokenInventoryItems(allItemIds);
        }
    }, [getBrokenInventoryItems, getNewInventoryItems, getUsedInventoryItems, inventory, isShowReportDialog]);

    return (
        <Page navbar={<Navbar/>}>
            <AutoSizer disableWidth>
                {({height}) => (
                    <Grid container spacing={2}>
                        <Grid size={selectedInventoryItems.length ? 8 : 12}>
                            <ToolbaredTable
                                title='Инвентарь'
                                buttons={isAdmin ? [
                                    {
                                        icon: <ReceiptIcon/>,
                                        tooltipTitle: 'Отчет',
                                        onClick: () => setIsShowReportDialog(true)
                                    },
                                    {
                                        icon: <AddIcon/>,
                                        tooltipTitle: 'Добавить',
                                        onClick: () => setIsShowAddDialog(true)
                                    },
                                    {
                                        icon: <DeleteIcon/>,
                                        tooltipTitle: 'Удалить',
                                        onClick: () => setIsShowDeleteDialog(true),
                                        disabled: !selectedInventoryItems.length
                                    },
                                ] : []}
                                selected={selectedInventoryItems}
                                setSelected={setSelectedInventoryItems}
                                size='medium'
                                maxHeight={height}
                                rows={inventory}
                                getItemId={(item) => item._id}
                                columns={[
                                    {header: "Наименование", getValue: (item) => String(item.name)},
                                    {header: "Новое", getValue: (item) => String(item.new)},
                                    {header: "Используется", getValue: (item) => String(item.used)},
                                    {header: "Сломано", getValue: (item) => String(item.broken)},
                                    {header: "Всего", getValue: (item) => String(item.total)},
                                ]}
                                clickable={isAdmin}
                                isShowCheckboxes={isAdmin}
                            />

                        </Grid>
                        {
                            selectedInventoryItems.length && (
                                <Grid size={4}>
                                    <InventoryCard height={height}/>
                                </Grid>
                            )
                        }
                    </Grid>
                )}
            </AutoSizer>

            <Dialog open={isShowReportDialog} onClose={() => setIsShowReportDialog(false)} fullScreen>
                <DialogTitle>Отчет</DialogTitle>
                <Divider/>
                <DialogContent style={{
                    display: 'flex',
                    gap: theme.spacing(2),
                    flexDirection: 'column',
                    margin: theme.spacing(2),
                    position: 'relative'
                }}>
                    <Box style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        overflow: 'auto'
                    }}>
                        <Typography variant="h4" textAlign="center">Новое</Typography>
                        <BaseTable
                            rows={newInventoryItems}
                            getItemId={(item) => item._id}
                            size="small"
                            columns={[
                                {header: "Наименование", getValue: (item) => String(item.name)},
                                {header: "Номер", getValue: (item) => String(item.serialNumber)},
                                {header: "Владелец", getValue: (item) => item.ownerUsername || '-'},
                            ]}
                        />

                        <Typography variant="h4" textAlign="center">Используется</Typography>
                        <BaseTable
                            rows={usedInventoryItems}
                            getItemId={(item) => item._id}
                            size="small"
                            columns={[
                                {header: "Наименование", getValue: (item) => String(item.name)},
                                {header: "Номер", getValue: (item) => String(item.serialNumber)},
                                {header: "Владелец", getValue: (item) => item.ownerUsername || '-'},
                            ]}
                        />

                        <Typography variant="h4" textAlign="center">Сломано</Typography>
                        <BaseTable
                            rows={brokenInventoryItems}
                            getItemId={(item) => item._id}
                            size="small"
                            columns={[
                                {header: "Наименование", getValue: (item) => String(item.name)},
                                {header: "Номер", getValue: (item) => String(item.serialNumber)},
                                {header: "Владелец", getValue: (item) => item.ownerUsername || '-'},
                            ]}
                        />
                    </Box>
                </DialogContent>
                <Divider/>
                <DialogActions color='secondary'>
                    <Button onClick={() => setIsShowReportDialog(false)}>ОК</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isShowAddDialog} onClose={() => setIsShowAddDialog(false)} fullWidth>
                <DialogTitle>Добавить инвентарь</DialogTitle>
                <Divider/>
                <DialogContent style={{
                    display: 'flex',
                    gap: theme.spacing(2),
                    flexDirection: 'column',
                    padding: theme.spacing(2)
                }}>
                    <TextField fullWidth label='Название' value={newItemName}
                               onChange={(e) => setNewItemName(e.target.value)}/>
                    <TextField fullWidth label='Кол-во' type="number" value={newItemAmount}
                               onChange={(e) => setNewItemAmount(Number(e.target.value))}/>
                </DialogContent>
                <Divider/>
                <DialogActions color='secondary'>
                    <Button variant={"contained"} color={"primary"} onClick={() => {
                        addInventoryItem({
                            name: newItemName,
                            amount: newItemAmount
                        })
                        setIsShowAddDialog(false)
                    }}>Добавить</Button>
                    <Button onClick={() => setIsShowAddDialog(false)}>Отмена</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isShowDeleteDialog} onClose={() => setIsShowDeleteDialog(false)}>
                <DialogTitle>Удалить выбранный инвентарь?</DialogTitle>
                <DialogActions color='secondary'>
                    <Button onClick={() => {
                        deleteInventoryItems(selectedInventoryItems);
                        setSelectedInventoryItems([]);
                        setIsShowDeleteDialog(false);
                    }}>Удалить</Button>
                    <Button onClick={() => setIsShowDeleteDialog(false)}>Отмена</Button>
                </DialogActions>
            </Dialog>
        </Page>
    );
};