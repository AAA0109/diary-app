import { useTranslation } from 'react-i18next';
import { Box, Grid, LinearProgress, Typography, linearProgressClasses, styled } from '@mui/material';
import { IStepperProps } from './IStepperProps';

export function AuthStepper({ steps, currentProgress, currentStep, Icon, setStep }: IStepperProps) {
    const { t } = useTranslation();

    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 6,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.primary.light,
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: theme.palette.primary.main,
            animationDuration: "2s",
        },
    }));

    return (
        <Box>
            <Box display="flex" alignItems="center">
                <Icon />
                <Box marginLeft="12px" textAlign="left">
                    <Typography fontWeight="400" fontSize="12px" color="#0F344A" style={{ opacity: .6, }}>
                        Step {currentStep + 1}
                    </Typography>
                    <Typography fontWeight="400" fontSize="16px">
                        {steps[currentStep]}
                    </Typography>
                </Box>
            </Box>
            <Grid spacing={1} container marginY="10px">
                {steps.map((step, index) => (
                    <Grid xs item key={index}>
                        <BorderLinearProgress variant="determinate" value={index === currentStep ? currentProgress : (index < currentStep ? 100 : 0)} onClick={() => {
                            if (currentStep > index) {
                                setStep(index);
                            }
                        }} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default AuthStepper;
