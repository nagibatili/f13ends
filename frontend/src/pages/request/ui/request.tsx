import {Navbar} from "../../../widgets/navbar/ui/navbar.tsx";
import {Page} from "../../../shared/ui/page/page.tsx";
import AutoSizer from "react-virtualized-auto-sizer";
import Grid from "@mui/material/Grid2";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, useTheme} from "@mui/material";
import {FC, useEffect} from "react";
import {Done} from "@mui/icons-material";
import {useRequestStore} from "../model/request-store.ts";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    ToolbaredTableWithSingleSelect
} from "../../../shared/ui/toolbared-table-with-single-select/toolbared-table-with-single-select.tsx";
import Typography from "@mui/material/Typography";
import {ERequestStatus, TRequest} from "../../../shared/api/request-service.ts";

export const RequestPage: FC = () => {
    const theme = useTheme();

    const requests = useRequestStore(state => state.requests);
    const getRequests = useRequestStore(state => state.getRequests);
    const approveRequest = useRequestStore(state => state.approveRequest);
    const rejectRequest = useRequestStore(state => state.rejectRequest);
    const deleteRequest = useRequestStore(state => state.deleteRequest);

    const selectedRequestId = useRequestStore(state => state.selectedRequestId);
    const setSelectedRequest = useRequestStore(state => state.setSelectedRequestId);

    const isShowApproveDialog = useRequestStore(state => state.isShowApproveDialog);
    const setIsShowApproveDialog = useRequestStore(state => state.setIsShowApproveDialog);

    const isShowDeleteDialog = useRequestStore(state => state.isShowDeleteDialog);
    const setIsShowDeleteDialog = useRequestStore(state => state.setIsShowDeleteDialog);

    const availableInventory = useRequestStore(state => state.availableInventory);
    const getAvailableInventory = useRequestStore(state => state.getAvailableInventory);

    const selectedRequest: TRequest | undefined = requests.find(request => request._id === selectedRequestId);

    useEffect(() => {
        getRequests();
    }, [getRequests]);

    useEffect(() => {
        if (selectedRequest) {
            getAvailableInventory(selectedRequest.type);
        }
    }, [getAvailableInventory, selectedRequest]);

    const isDisabledApprove = !selectedRequest || selectedRequest.status !== ERequestStatus.pending;

    return (
        <Page navbar={<Navbar/>}>
            <AutoSizer disableWidth>
                {({height}) => (
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <ToolbaredTableWithSingleSelect
                                title='Заявки'
                                buttons={[
                                    {
                                        icon: <Done/>,
                                        tooltipTitle: 'Одобрить',
                                        onClick: () => setIsShowApproveDialog(true),
                                        disabled: isDisabledApprove
                                    },
                                    {
                                        icon: <DeleteIcon/>,
                                        tooltipTitle: 'Удалить',
                                        onClick: () => setIsShowDeleteDialog(true),
                                        disabled: !selectedRequestId
                                    },
                                ]}
                                selected={selectedRequestId}
                                setSelected={setSelectedRequest}
                                size='medium'
                                maxHeight={height}
                                rows={requests}
                                getItemId={(item) => item._id}
                                columns={[
                                    {header: "Тип", getValue: (item) => String(item.type)},
                                    {header: "Статус", getValue: (item) => String(item.status)},
                                    {header: "Кол-во", getValue: (item) => String(item.amount)},
                                    {header: "Пользователь", getValue: (item) => String(item.applicantUsername)},
                                ]}
                                clickable
                            />

                        </Grid>
                    </Grid>
                )}
            </AutoSizer>

            <Dialog open={isShowApproveDialog} onClose={() => setIsShowApproveDialog(false)} fullWidth>
                <DialogTitle>Одобрить заявку</DialogTitle>
                <Divider/>
                <DialogContent style={{
                    display: 'flex',
                    gap: theme.spacing(2),
                    flexDirection: 'column',
                    padding: theme.spacing(2)
                }}>
                    <Typography variant={"subtitle1"}>
                        Требуется {selectedRequest?.type} в количестве {selectedRequest?.amount} шт.
                    </Typography>
                    <Typography variant={"subtitle2"}>
                        В наличии {availableInventory.length} шт.
                    </Typography>
                </DialogContent>
                <Divider/>
                <DialogActions color='secondary'>
                    <Button
                        variant={"contained"}
                        color={"primary"}
                        disabled={selectedRequest && availableInventory.length < selectedRequest.amount}
                        onClick={() => {
                            approveRequest();
                            setIsShowApproveDialog(false)
                        }}
                    >
                        Одобрить
                    </Button>
                    <Button onClick={() => {
                        rejectRequest(selectedRequestId);
                        setIsShowApproveDialog(false);
                    }}>Отклонить</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isShowDeleteDialog} onClose={() => setIsShowDeleteDialog(false)}>
                <DialogTitle>Удалить заявку?</DialogTitle>
                <DialogActions color='secondary'>
                    <Button onClick={() => {
                        deleteRequest(selectedRequestId);
                        setSelectedRequest('');
                        setIsShowDeleteDialog(false);
                    }}>Удалить</Button>
                    <Button onClick={() => setIsShowDeleteDialog(false)}>Отмена</Button>
                </DialogActions>
            </Dialog>
        </Page>
    )
}