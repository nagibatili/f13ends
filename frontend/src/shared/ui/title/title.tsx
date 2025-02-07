import { FC } from "react";
import styles from "./title.module.scss";

interface TitleProps {
    text: string;
    className?: string;
}
export const Title: FC<TitleProps> = (props) => {
    const { text, className } = props;

    return <div className={styles.root + " " + className}>{text}</div>;
};
