import { FC } from "react";
import styles from "./input.module.scss";

interface InputProps
    extends React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {}

export const Input: FC<InputProps> = (props) => {
    const { className, ...rest } = props;
    return <input className={styles.root + " " + className} {...rest} />;
};
