import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Checkbox} from "@mui/material";
import {ChangeEventHandler} from "react";

export type BaseTableColumn<T> = {
    header: string;
    getValue: (item: T) => string;
};

export interface IBaseTable<T> {
    rows: T[];
    size?: "small" | "medium" | undefined;
    getItemId: (item: T) => string;
    columns: BaseTableColumn<T>[];
    elevation?: number | undefined;
    maxHeight?: number | undefined;

    selected?: string[];
    setSelected?: ((selected: string[]) => void) | undefined;
    clickable?: boolean | undefined;
    isShowCheckboxes?: boolean | undefined
}

export const BaseTable = <T, >(props: IBaseTable<T>) => {

    const {size, columns, rows, getItemId, elevation, maxHeight, selected = [], setSelected, clickable, isShowCheckboxes} = props;

    const renderHeaders = columns.map((column) => (
        <TableCell key={column.header} align="right">{column.header}</TableCell>
    ));

    const handleClick = (id: string) => {
        if (clickable === false) return;
        if (!setSelected) return;

        const selectedIndex = selected.indexOf(id);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };


    const renderRows = rows.map((row) => {

        const isItemSelected = selected.includes(getItemId(row));

        return (
            <TableRow
                key={getItemId(row)}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                onClick={() => handleClick(getItemId(row))}
                hover={clickable}
                selected={isItemSelected}
            >
                {clickable && isShowCheckboxes &&
                    <TableCell padding="checkbox">
                        <Checkbox
                            color="primary"
                            checked={isItemSelected}
                        />
                    </TableCell>
                }

                {columns.map((column) => (
                    <TableCell key={column.header} align="right">{column.getValue(row)}</TableCell>))}
            </TableRow>
        )
    })

    const numSelected = selected.length;
    const rowCount = rows.length;

    const handleSelectAllClick: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (!setSelected) return;

        if (event.target.checked) {
            const newSelected = rows.map((n) => getItemId(n));
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    return (
        <TableContainer component={Paper} elevation={elevation} style={{maxHeight}}>
            <Table size={size} stickyHeader>
                <TableHead>
                    <TableRow>
                        {
                            clickable && isShowCheckboxes &&
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    indeterminate={numSelected > 0 && numSelected < rowCount}
                                    checked={rowCount > 0 && numSelected === rowCount}
                                    onChange={handleSelectAllClick}
                                    inputProps={{
                                        'aria-label': 'select all desserts',
                                    }}
                                />
                            </TableCell>
                        }
                        {renderHeaders}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {renderRows}
                </TableBody>
            </Table>
        </TableContainer>
    )
};