import React, { useEffect } from 'react';
import Footer from 'oldComponents/footer';
import { styled } from '@mui/material/styles';
import useAuth from 'hooks/useAuth';
import { PATH_MAIN } from 'routes/paths';
// ----------------------------------------------------------------------

const AppbarStyle = styled('div')(() => ({
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    '& > div': {
        width: '100%',
        height: '510px',
        position: 'absolute',
        left: '40%',
        opacity: 0.2,
    },
}));

const ContainerStyle = styled('div')(({ theme }) => ({
    position: 'relative',
    flexDirection: 'column',
    display: 'flex',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: '1 0 auto',
    padding: '55px 0 11px 0',
    [theme.breakpoints.down('xs')]: {
        padding: '0px 0 11px 0',
    },
    '&:before': {
        position: 'absolute',
        top: '-145px',
        left: '0',
        width: '100%',
        minHeight: '365px',
        height: '60vh',
        content: '" "',
        // background: `${theme.palette.secondary.light} url(${config.settings.publicCover})`,
        // backgroundColor: '#1e4fea;',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        transition: 'background .4s',
        backgroundPositionY: 'initial',
        backgroundPositionX: 'center',
    },
}));

const CenterRootStyle = styled('div')(({ theme }) => ({
    maxWidth: 1240,
    width: '100%',
    flex: '1',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
        margin: 0,
        padding: 0,
    },
}));

const CenterContainerStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    margin: '0 auto',
    textAlign: 'center',
    width: 320,
    overflow: 'hidden',
    [theme.breakpoints.down('xs')]: {
        boxShadow: 'unset',
        margin: 0,
        padding: 0,
        width: '100% !important',
        borderRadius: 0,
    },
    [theme.breakpoints.up('md')]: {
        width: 435,
        height: "100%",
        padding: "50px 0",
    },
    [theme.breakpoints.down('sm')]: {
        height: "100%",
    }
}));

const PageStyle = styled('div')(({ theme }) => ({
    backgroundColor: 'white',
    [theme.breakpoints.down('xs')]: {
        margin: 0,
        padding: 0,
        width: '100%',
        backgroundColor: 'transparent',
    },
    zIndex: 1,
    minWidth: 320,
    [theme.breakpoints.up('md')]: {
        margin: 'auto',
        width: "435px",
        height: "100%",
    },
}));

const GapStyle = styled('div')(() => ({
    height: 60,
}));

// ----------------------------------------------------------------------

export interface AuthWrapperProps {
    children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {

    const { user } = useAuth();

    useEffect(() => {
        if (user && window.location.pathname !== PATH_MAIN.onboarding) {
            window.location.href = '/';
        }
    }, [user])

    return (
        <>
            <AppbarStyle>
                {/* <Logo /> */}
            </AppbarStyle>
            <ContainerStyle>
                <CenterRootStyle>
                    <CenterContainerStyle>
                        <PageStyle>{children}</PageStyle>
                    </CenterContainerStyle>
                </CenterRootStyle>
            </ContainerStyle>
        </>
    );
}
