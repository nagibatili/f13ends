import {FC, useEffect} from "react";
import {Navbar} from "../../../widgets/navbar/ui/navbar.tsx";
import { Page } from "../../../shared/ui/page/page.tsx";
import Grid from "@mui/material/Grid2";
import {ToolbaredTable} from "../../../shared/ui/toolbared-table/toolbared-table.tsx";
import AutoSizer from "react-virtualized-auto-sizer";
import {useUserInventoryStore} from "../model/user-inventory-store.ts";
import { useAppStore } from "../../../shared/model/app-store.ts";

export const UserInventoryPage: FC = () => {
    const userId = useAppStore(state => state.userId);
    const inventory = useUserInventoryStore(state => state.inventory);
    const getUserInventory = useUserInventoryStore(state => state.getUserInventory);

    useEffect(() => {
        getUserInventory(userId);
    }, [getUserInventory, userId]);

    return (
        <Page navbar={<Navbar/>}>
            <AutoSizer disableWidth>
                {({height}) => (
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <ToolbaredTable
                                buttons={[]}
                                title='Мой инвентарь'
                                size='medium'
                                maxHeight={height}
                                rows={inventory}
                                getItemId={(item) => item._id}
                                columns={[
                                    {header: "Тип", getValue: (item) => String(item.name)},
                                    {header: "Номер", getValue: (item) => String(item.serialNumber)},
                                    {header: "Статус", getValue: (item) => String(item.status)},

                                ]}
                            />

                        </Grid>
                    </Grid>
                )}
            </AutoSizer>
        </Page>
    )
}