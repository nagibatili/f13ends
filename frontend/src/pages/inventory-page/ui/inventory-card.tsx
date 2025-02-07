import {FC, useEffect} from "react";
import Paper from "@mui/material/Paper";
import {Box} from "@mui/material";
import {useInventoryStore} from "../model/inventory-store.ts";
import {CardSection} from "./card-section.tsx";

interface IInventoryCard {
    height: number
}

export const InventoryCard: FC<IInventoryCard> = (props) => {

    const {height} = props;

    const selectedInventoryItems = useInventoryStore(state => state.selectedInventoryItems);

    const newInventoryItems = useInventoryStore(state => state.newInventoryItems);
    const getNewInventoryItems = useInventoryStore(state => state.getNewInventoryItems);

    const usedInventoryItems = useInventoryStore(state => state.usedInventoryItems);
    const getUsedInventoryItems = useInventoryStore(state => state.getUsedInventoryItems);

    const brokenInventoryItems = useInventoryStore(state => state.brokenInventoryItems);
    const getBrokenInventoryItems = useInventoryStore(state => state.getBrokenInventoryItems);

    useEffect(() => {
        console.log({selectedInventoryItems})
    }, [selectedInventoryItems]);

    useEffect(() => {
        getNewInventoryItems(selectedInventoryItems);
        getUsedInventoryItems(selectedInventoryItems);
        getBrokenInventoryItems(selectedInventoryItems);
    }, [selectedInventoryItems, getNewInventoryItems, getUsedInventoryItems, getBrokenInventoryItems]);

    return (
        <Box style={{maxHeight: height, overflow: 'auto'}} component={Paper}>
            <CardSection title="Новое" tableItems={newInventoryItems} />
            <CardSection title="Используется" tableItems={usedInventoryItems} />
            <CardSection title="Сломано" tableItems={brokenInventoryItems} />
        </Box>
    )
}