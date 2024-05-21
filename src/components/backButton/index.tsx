import { Box, Button, Theme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function BackButton({ ending, handleBack, bgColor }: { ending?: any, handleBack?: any, bgColor?: string }) {
    const navigate = useNavigate();
    const smUpHidden = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

    const goBack = () => {
        if (handleBack) {
            handleBack();
        }
        else {
            navigate(-1);
        }
    }

    return (
        <Box display='flex' justifyContent="flex-start" alignItems="center" marginY="8px">
            <Button style={{
                backgroundColor: bgColor ?? "rgba(218, 235, 246, .5)",
                borderRadius: 12,
                width: 40,
                minWidth: 40,
                height: 40,
            }} onClick={goBack}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="17"
                    fill="none"
                    viewBox="0 0 21 17"
                >
                    <path
                        stroke="#469AD0"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 8.5H1m0 0L7.963 16M1 8.5L7.963 1"
                    />
                </svg>
            </Button>
            {ending}
        </Box>
    );
}

export default BackButton;
