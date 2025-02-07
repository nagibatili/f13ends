import {ChangeEventHandler, FC, useEffect, useState} from "react";
import Grid from '@mui/material/Grid2';
import AutoSizer from "react-virtualized-auto-sizer";
import {Page} from "../../../shared/ui/page/page.tsx";
import {ToolbaredTable} from "../../../shared/ui/toolbared-table/toolbared-table.tsx";
import {Navbar} from "../../../widgets/navbar/ui/navbar.tsx";
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
import {Done} from "@mui/icons-material";
import {usePlanStore} from "../model/plan-store.ts";
import {TPlanItem} from "../../../shared/api/plan-service.ts";
import {useInventoryStore} from "../../inventory-page/model/inventory-store.ts";

export const PlanPage: FC = () => {

    const theme = useTheme();

    const planItems = usePlanStore(state => state.planItems);
    const getPlanItems = usePlanStore(state => state.getPlanItems);
    const addPlanItem = usePlanStore(state => state.addPlanItem);
    const deletePlanItems = usePlanStore(state => state.deletePlanItems);
    const donePlanItem = usePlanStore(state => state.donePlanItem);

    const inventoryTypes = useInventoryStore(state => state.inventoryTypes);
    const getInventoryTypes = useInventoryStore(state => state.getInventoryTypes);

    const [isShowAddDialog, setIsShowAddDialog] = useState(false);
    const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);

    const [selectedInventoryItems, setSelectedInventoryItems] = useState<string[]>([]);

    const [addFields, setAddFields] = useState<Omit<TPlanItem, '_id'>>(() => ({
        type: '',
        amount: 0,
        price: 0,
        supplier: ''
    }));

    const onChangeField: ChangeEventHandler<HTMLInputElement> = (e) => setAddFields({
        ...addFields,
        [e.target.name]: e.target.value
    });

    useEffect(() => {
        getPlanItems();
        getInventoryTypes();
    }, [getPlanItems, getInventoryTypes]);

    return (
        <Page navbar={<Navbar/>}>
            <AutoSizer disableWidth>
                {({height}) => (
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <ToolbaredTable
                                title='План'
                                buttons={[
                                    {
                                        icon: <AddIcon/>,
                                        tooltipTitle: 'Добавить',
                                        onClick: () => setIsShowAddDialog(true)
                                    },
                                    {
                                        icon: <Done/>,
                                        tooltipTitle: 'Выполнено',
                                        onClick: () => {
                                            donePlanItem(selectedInventoryItems);
                                            setSelectedInventoryItems([]);
                                        },
                                        disabled: !selectedInventoryItems.length
                                    },
                                    {
                                        icon: <DeleteIcon/>,
                                        tooltipTitle: 'Удалить',
                                        onClick: () => setIsShowDeleteDialog(true),
                                        disabled: !selectedInventoryItems.length
                                    },
                                ]}
                                selected={selectedInventoryItems}
                                setSelected={setSelectedInventoryItems}
                                size='medium'
                                maxHeight={height}
                                rows={planItems}
                                getItemId={(item) => item._id}
                                columns={[
                                    {header: "Тип", getValue: (item) => String(item.type)},
                                    {header: "Кол-во", getValue: (item) => String(item.amount)},
                                    {header: "Цена", getValue: (item) => String(item.price)},
                                    {header: "Поставщик", getValue: (item) => String(item.supplier)},
                                ]}
                                clickable
                                isShowCheckboxes
                            />

                        </Grid>
                    </Grid>
                )}
            </AutoSizer>

            <Dialog open={isShowAddDialog} onClose={() => setIsShowAddDialog(false)} fullWidth>
                <DialogTitle>Добавить инвентарь</DialogTitle>
                <Divider/>
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
                    <TextField
                        fullWidth
                        label='Цена'
                        type="number"
                        value={addFields.price}
                        name='price'
                        onChange={onChangeField}
                    />
                    <TextField
                        fullWidth
                        label='Поставщик'
                        value={addFields.supplier}
                        name='supplier'
                        onChange={onChangeField}
                    />

                </DialogContent>
                <Divider/>
                <DialogActions color='secondary'>
                    <Button variant={"contained"} color={"primary"} onClick={() => {
                        addPlanItem({
                            ...addFields,
                        } as TPlanItem);
                        setIsShowAddDialog(false)
                    }}>Добавить</Button>
                    <Button onClick={() => setIsShowAddDialog(false)}>Отмена</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isShowDeleteDialog} onClose={() => setIsShowDeleteDialog(false)}>
                <DialogTitle>Удалить выбранный инвентарь?</DialogTitle>
                <DialogActions color='secondary'>
                    <Button onClick={() => {
                        deletePlanItems(selectedInventoryItems);
                        setSelectedInventoryItems([]);
                        setIsShowDeleteDialog(false);
                    }}>Удалить</Button>
                    <Button onClick={() => setIsShowDeleteDialog(false)}>Отмена</Button>
                </DialogActions>
            </Dialog>
        </Page>
    );
};