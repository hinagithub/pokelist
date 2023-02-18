import { Button } from "@mui/material"
import { ReactNode } from 'react';

type Props = {
    func: () => void
    children: ReactNode
    icon: JSX.Element
}
export const IconBtn = (props: Props) => {
    const { func, children, icon } = props
    return (
        <Button
            variant="text"
            color="secondary"
            size="large"
            sx={{ borderRadius: 10, color: "#443C68", fontSize: "1.2rem" }}
            startIcon={icon}
            onClick={func}
        >
            {children}
        </Button>
    )
}