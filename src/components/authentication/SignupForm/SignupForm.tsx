import Typography from '@mui/material/Typography';
import { Box, Button, styled } from '@mui/material';
import AuthStepper from 'components/stepper';
import SwipeableViews from 'react-swipeable-views';
import { useEffect, useState } from 'react';
import useAuth from 'hooks/useAuth';
import SignupStep1 from './SignupStep1';
import SignupStep2 from './SignupStep2';
import SignupStep3 from './SignupStep3';
import BackButton from 'components/backButton';
import { useNavigate } from 'react-router';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    padding: '0',
    height: 'calc(100% - 240px)',
}));

const SwipableStyle = styled('div')(({ theme }) => ({
    height: '100%',
    marginTop: '32px',
    '&>div, & .react-swipeable-view-container': {
        height: '100%',
    }
}));

// ----------------------------------------------------------------------

export default function SignupComponent() {
    const [step, setStep] = useState(0);
    const {currentRegisterStep} = useAuth();
    const [currentProgress, setCurrentProgress] = useState(0);
    const navigate = useNavigate();

    const handleProgress = (progress: number) => {
        setCurrentProgress(Math.max(0, Math.min(progress, 100)));
    }

    useEffect(() => {
        setStep(currentRegisterStep());
    }, [])

    const handleBack = () => {
        if(step > 0) {
            setStep(step - 1);
        }
        else {
            navigate(-1);
        }
    }

    return (
        <RootStyle>
            <BackButton handleBack={handleBack} />

            <Typography fontWeight="400" fontSize="26px" textAlign="left" marginBottom="20px">
                Create <span style={{ color: '#469AD0', fontWeight: 600, }} >Account</span><span style={{ fontWeight: 600, }}>!</span>
            </Typography>

            <AuthStepper steps={['Personal Information', 'Guardian Information', 'Account Information']} currentStep={step} setStep={setStep} currentProgress={currentProgress} Icon={() => (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="29"
                    height="29"
                    fill="none"
                    viewBox="0 0 29 29"
                >
                    <path
                        stroke="#469AD0"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M14.234 12.068l6.44 1.726M13.2 15.932l3.863 1.035M2.896 20.93c.805 3.007 1.208 4.51 2.121 5.486A5.334 5.334 0 007.7 27.964c1.3.303 2.804-.1 5.811-.905 3.007-.806 4.51-1.209 5.485-2.122A5.334 5.334 0 0020.42 22.7M9.887 7.328c-.47.122-.985.26-1.553.412-3.007.806-4.51 1.209-5.486 2.122A5.334 5.334 0 001.3 12.543c-.214.92-.076 1.942.309 3.525"
                    />
                    <path
                        stroke="#0F344A"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M25.616 15.597c-.806 3.007-1.209 4.51-2.122 5.485a5.332 5.332 0 01-2.681 1.548c-.129.03-.259.053-.392.07-1.22.15-2.71-.249-5.42-.975-3.006-.806-4.51-1.209-5.485-2.122a5.333 5.333 0 01-1.548-2.681c-.303-1.301.1-2.805.905-5.811l.69-2.576c.116-.433.224-.834.326-1.207.607-2.222 1.014-3.444 1.796-4.278A5.333 5.333 0 0114.367 1.5c1.3-.303 2.804.1 5.811.905 3.007.806 4.51 1.209 5.485 2.122a5.332 5.332 0 011.548 2.682c.215.92.076 1.941-.308 3.524"
                    />
                </svg>
            )} />
            <SwipableStyle>
                <SwipeableViews index={step} disabled={true}>
                    <SignupStep1 handleProgress={handleProgress} handleNext={setStep} />
                    <SignupStep2 handleProgress={handleProgress} handleNext={setStep} />
                    <SignupStep3 handleProgress={handleProgress} handleNext={setStep} />
                </SwipeableViews>
            </SwipableStyle>
        </RootStyle>
    );
}
