import {IToolbaredTable, ToolbaredTable} from "../toolbared-table/toolbared-table.tsx";

interface IToolbaredTableWithSingleSelect<T> extends Omit<IToolbaredTable<T>, "selected" | "setSelected"> {
    selected: string;
    setSelected: (id: string) => void;
}

export const ToolbaredTableWithSingleSelect = <T, >(props: IToolbaredTableWithSingleSelect<T>) => {
    const {selected, setSelected, ...rest} = props;

    return (
        <ToolbaredTable
            selected={selected ? [selected] : []}
            setSelected={(ids) => setSelected(ids?.at(-1) || "")}
            {...rest}
        />
    );
};