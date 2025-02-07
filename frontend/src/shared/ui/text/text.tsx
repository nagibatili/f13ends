import { FC } from "react"
import styles from "./text.module.scss"
import clsx from "clsx"

interface TextProps {
    text: string
    variant: "extra-bold"
}

export const Text: FC<TextProps> = (props) => {
    return <div className={clsx(styles.text, styles[props.variant])}>{props.text}</div>
}
