import { FC } from "react";
import { Text } from "../text/text.tsx";
import styles from "./button.module.scss";

interface ButtonProps
    extends React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    text: string;
}
export const Button: FC<ButtonProps> = (props) => {
    const { text, className, ...rest } = props;

    return (
        <button className={styles.root + " " + className} {...rest}>
            <Text text={text} variant="extra-bold" />
        </button>
    );
};
