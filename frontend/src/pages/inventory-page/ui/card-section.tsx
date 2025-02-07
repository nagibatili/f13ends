import {FC, useId, useState} from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {BaseTable, BaseTableColumn} from "../../../shared/ui/base-table/base-table.tsx";
import Card from "@mui/material/Card";
import {EInventoryStatus, TInventoryItem} from "../../../shared/api/inventory-service.ts";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Divider,
    FormControl,
    IconButton, InputLabel,
    Select, Stack
} from "@mui/material";
import Box from "@mui/material/Box";
import {Edit} from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import {useInventoryStore} from "../model/inventory-store.ts";

interface ICardSection {
    title: string;
    tableItems: TInventoryItem[];
}

export const CardSection: FC<ICardSection> = ({title, tableItems}) => {

    const tableColumns: BaseTableColumn<TInventoryItem>[] = [
        {header: "Название", getValue: (item) => item.name},
        {header: "Серийный номер", getValue: (item) => item.serialNumber},
        {header: "Владелец", getValue: (item) => item.ownerUsername || '-'},
    ];

    const selectLabelId = useId();

    const updateItemsStatus = useInventoryStore(state => state.updateItemsStatus);

    const [isShowEditDialog, setIsShowEditDialog] = useState(false);

    const [selected, setSelected] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<EInventoryStatus | "">("");

    const cleanup = () => {
        setSelected([]);
        setSelectedStatus("");
    }

    return (
        <>
            <Card elevation={0}>
                <CardContent>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Typography gutterBottom variant="h5" component="div">
                            {title}
                        </Typography>
                        <IconButton onClick={() => setIsShowEditDialog(true)}>
                            <Edit/>
                        </IconButton>
                    </Box>

                    <BaseTable maxHeight={300} elevation={0} size='small' rows={tableItems}
                               getItemId={(item) => item._id} columns={tableColumns}/>
                </CardContent>
            </Card>
            <Dialog open={isShowEditDialog} onClose={() => setIsShowEditDialog(false)} fullWidth>
                <DialogTitle>Редактирование</DialogTitle>
                <Divider />
                <DialogContent>
                    <Stack spacing={2}>
                        <Typography variant={"overline"}>Выберите элементы</Typography>
                        <BaseTable
                            elevation={0}
                            size="small"
                            maxHeight={300}
                            rows={tableItems}
                            getItemId={(item) => item._id}
                            columns={tableColumns}
                            selected={selected}
                            setSelected={setSelected}
                            isShowCheckboxes
                            clickable
                        />
                        <Typography variant={"overline"}>Изменить статус выбранных на</Typography>
                        <FormControl fullWidth>
                            <InputLabel id={selectLabelId}>Статус</InputLabel>
                            <Select label='Статус' labelId={selectLabelId} value={selectedStatus}
                                    onChange={(ev) => setSelectedStatus(ev.target.value as EInventoryStatus)}>
                                <MenuItem value={EInventoryStatus.new}>Новое</MenuItem>
                                <MenuItem value={EInventoryStatus.used}>Используется</MenuItem>
                                <MenuItem value={EInventoryStatus.broken}>Сломано</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <Divider />
                <DialogActions>
                    <Button onClick={() => {
                        if (!selectedStatus) return;

                        setIsShowEditDialog(false);

                        console.log("selected", selected);
                        console.log("selectedStatus", selectedStatus);

                        updateItemsStatus(selected, selectedStatus);

                        cleanup();
                    }} variant={"contained"} color={"primary"}>Сохранить</Button>
                    <Button onClick={() => {
                        setIsShowEditDialog(false);
                        cleanup();
                    }}>Отменить</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}