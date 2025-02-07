import {BaseTable, IBaseTable} from "../base-table/base-table.tsx";
import {Box, IconButton, Stack, Toolbar, Tooltip} from "@mui/material";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import AutoSizer from "react-virtualized-auto-sizer";
import {MouseEventHandler, ReactNode} from "react";

export interface IToolbaredTable<T> extends IBaseTable<T> {
    title: string;
    buttons: {
        icon: ReactNode;
        tooltipTitle: string;
        disabled?: boolean | undefined;
        onClick: MouseEventHandler<HTMLButtonElement> | undefined;
    }[];
}

export const ToolbaredTable = <T, >(props: IToolbaredTable<T>) => {
    const {maxHeight, title, buttons, ...rest} = props;

    const renderButtons = buttons.map((button, index) => {
        return (
            <Tooltip key={index} title={button.tooltipTitle}>
                <IconButton onClick={button.onClick} disabled={button.disabled}>
                    {button.icon}
                </IconButton>
            </Tooltip>
        );
    });

    return (
        <Stack spacing={2} height={maxHeight}>
            <Toolbar component={Paper}>
                <Typography variant="h4" component="div" style={{flex: '1 1 auto'}}>
                    {title}
                </Typography>
                <Stack direction="row" justifyItems="end">
                    {renderButtons}
                </Stack>
            </Toolbar>
            <Box style={{flex: '1 1 auto'}}>
                <AutoSizer disableWidth>
                    {({height}) => (
                        <BaseTable maxHeight={height} {...rest} />
                    )}
                </AutoSizer>
            </Box>

        </Stack>
    );
};