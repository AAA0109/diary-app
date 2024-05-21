import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import classNames from 'classnames';
import React, { useState } from 'react';
import CookieConsent from 'react-cookie-consent';
import { useIdleTimer } from 'react-idle-timer';
import HomeHeader from 'components/HomeHeader';
import Typography from '@mui/material/Typography';
import { Badge, Box } from '@mui/material';
import { log } from 'utils/log';
import { addNotifyAudio } from 'utils/audio';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Map, List } from 'immutable';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import useTheme from '@mui/material/styles/useTheme';
import { Theme } from '@mui/material/styles/createTheme';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { useLocation, useNavigate } from 'react-router-dom';
import useDiary from 'hooks/useDiary';
import NavItem from 'components/navItem';
import { PATH_MAIN } from 'routes/paths';
import { useStyles } from './homeStyles';
import { menuItems } from './menuItems';
import HomeIcon from 'components/icons/HomeIcon';
import AvatarCheckIcon from 'components/icons/AvatarCheckIcon';
import CommunityIcon from 'components/icons/CommunityIcon';
import SettingsIcon from 'components/icons/SettingsIcon';
import SharpIcon from 'components/icons/SharpIcon';
import { globalSelector } from 'redux/reducers/global/globalSelector';
import * as globalActions from 'redux/actions/globalActions';
import DiaryIcon from 'components/icons/DiaryIcon';
import MessageIcon from 'components/icons/MessageIcon';
import useAuth from 'hooks/useAuth';

// selectors
const selectCurrentUser = authorizeSelector.selectCurrentUser();

const hideBottomNavigationPages = [
    '/chats/'
]

// ----------------------------------------------------------------------

export interface HomeProps {
    children?: React.ReactNode;
}

const selectNavigationStep = globalSelector.selectNavigationStep();

export function HomeComponent({ children }: HomeProps) {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const step = useSelector((state: Map<string, any>) => selectNavigationStep(state)) as number;
    const { user } = useAuth();

    const { t } = useTranslation();
    const classes = useStyles();
    const theme = useTheme();
    const { pathname } = useLocation();

    const hideBottomNavigation = hideBottomNavigationPages.some(page => pathname.startsWith(page));
    const { notificationList } = useDiary();

    React.useEffect(() => {
        window.addEventListener(
            'click',
            () => {
                addNotifyAudio();
            },
            { once: true },
        );
    }, []);


    const handleOnIdle = () => {
        log.info('last active', getLastActiveTime());
    };

    const handleOnActive = () => {
        log.info('time remaining', getRemainingTime());
    };

    const handleOnAction = () => {
        log.info('user did something!');
    };

    const { getRemainingTime, getLastActiveTime } = useIdleTimer({
        timeout: 1000 * 60 * 15,
        onIdle: handleOnIdle,
        onActive: handleOnActive,
        onAction: handleOnAction,
        debounce: 500,
    });

    const anchor = theme.direction === 'rtl' ? 'right' : 'left';

    return (
        <div className={classes.root}>
            <div className={classes.appFrame}>
                <main
                    className={classNames(classes.content, classes[`content-${anchor}`], {
                        [classes.contentShift]: drawerOpen,
                        [classes[`contentShift-${anchor}`]]: drawerOpen,
                    })}
                    style={{ paddingBottom: hideBottomNavigation ? 0 : 80 }}
                >
                    {children}
                </main>
                {!hideBottomNavigation && <Box className={classes.bottomNavigation}>
                    <Box className={classes.navigationPane}>
                        {/* <HomeIcon onClick={() => navigate(PATH_MAIN.user.home)} color={step === 0 ? "#469AD0" : "#0F344A"} className={classes.bottomNavigationButton} /> */}
                        <DiaryIcon onClick={() => navigate(PATH_MAIN.diary.allDiaries)} color={step === 0 ? "#469AD0" : "#8799A4"} className={classes.bottomNavigationButton} />
                        <AvatarCheckIcon onClick={() => navigate(PATH_MAIN.family.home)} color={step === 1 ? "#469AD0" : "#8799A4"} className={classes.bottomNavigationButton} />
                        <Box position="relative" flex="1" zIndex="10">
                            <SharpIcon style={{ opacity: 0 }} />
                            <Box className={classes.bottomNavigationMainButton}>
                                <Box className={classes.primaryButton} onClick={() => navigate(PATH_MAIN.user.home)}>
                                    <SharpIcon color="white" />
                                </Box>
                            </Box>
                        </Box>
                        {/* <Badge color="error" variant="dot" invisible={!notificationList.length}> */}
                            <MessageIcon onClick={() => navigate(PATH_MAIN.chats.home)} color={step === 3 ? "#469AD0" : "#8799A4"} className={classes.bottomNavigationButton} />
                        {/* </Badge> */}

                        {!user?.guardianId && <CommunityIcon onClick={() => navigate(PATH_MAIN.community.home)} color={step === 4 ? "#469AD0" : "#8799A4"} className={classes.bottomNavigationButton} />}
                        {user?.guardianId && <SettingsIcon onClick={() => navigate(PATH_MAIN.user.account)} color={step === 4 ? "#469AD0" : "#8799A4"} className={classes.bottomNavigationButton} />}
                        {/* <SettingsIcon onClick={() => navigate(PATH_MAIN.user.account)} color={step === 4 ? "#469AD0" : "#8799A4"} className={classes.bottomNavigationButton} /> */}
                        <Box className={classes.hoverline} left={`${100 / 5 * step}%`} width={step === 2 ? 0 : "20%"} />
                    </Box>
                </Box>}
            </div>

            <CookieConsent
                location="bottom"
                buttonText={t('home.cookieConsentButton')}
                cookieName="social-consent"
                style={{ background: '#2B373B', zIndex: 1200 }}
                buttonStyle={{ color: '#4e503b', fontSize: '13px' }}
                expires={150}
            >
                {t('home.cookieConsentText')}{' '}
            </CookieConsent>
        </div>
    );
}

export default HomeComponent;
