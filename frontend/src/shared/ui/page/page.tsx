import {CSSProperties, ReactNode} from "react";
import {Stack} from "@mui/material";

interface PageProps {
    children: ReactNode;
    navbar?: ReactNode;
    className?: string;
    style?: CSSProperties;
}

export const Page = ({children, navbar, style}: PageProps) => {
    return (
        <Stack spacing={2} height={"100%"} style={{height: "100%", ...style}}>
            {navbar}
            <div style={{flex: '1 1 auto'}}>
                {children}
            </div>
        </Stack>
    );
};
