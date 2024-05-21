import { Theme } from '@mui/material/styles';
import { makeStyles, createStyles } from '@mui/styles';

const drawerWidth = 256;
export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            [theme.breakpoints.down('lg')]: {
                maxWidth: '640px !important',
            },
            [theme.breakpoints.down('md')]: {
                maxWidth: '480px !important',
            },
            maxWidth: '800px !important',
            margin: '0 auto',
            width: '100%',
            minheight: '100%',
            overflow: 'hidden',
        },
        appFrame: {
            position: 'relative',
            display: 'flex',
            width: '100%',
            height: '100%',
            // overflowY: 'auto'
        },
        navIconHide: {
            [theme.breakpoints.up('md')]: {
                display: 'none',
            },
        },
        drawerHeader: {
            padding: 10,
            marginLeft: 10,
        },
        drawerPaper: {
            maxWidth: drawerWidth,
            width: drawerWidth,
            [theme.breakpoints.up('md')]: {
                width: drawerWidth,
                position: 'relative',
                height: '100%',
            },
        },
        drawerPaperLarge: {
            width: `${drawerWidth}px !important`,
            'z-index': `${theme.zIndex.drawer} !important`,
            [theme.breakpoints.up('md')]: {
                width: drawerWidth,
                height: '100%',
            },
            backgroundColor: '#fafafa !important',
        },
        menu: {
            height: '100%',
        },
        content: {
            backgroundColor: 'transparent',
            width: '100%',
            flexGrow: 1,
            // paddingTop: 15,
            padding: 0,
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflow: 'auto',
            overflowX: 'hidden',
            minHeight: '100%',
            // marginTop: 44,
            [theme.breakpoints.up('sm')]: {
                height: 'calc(100% - 20px)',
            },
            [theme.breakpoints.down('sm')]: {
                height: 'calc(100% - 20px)',
            },
        },
        'content-left': {
            marginLeft: 0,
        },
        'content-right': {
            marginRight: 0,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        'contentShift-left': {
            marginLeft: 0,
            [theme.breakpoints.up('md')]: {
                marginLeft: drawerWidth,
            },
        },
        'contentShift-right': {
            marginRight: 0,
            [theme.breakpoints.up('md')]: {
                marginRight: drawerWidth,
            },
        },
        logo: {
            width: '100% !important',
            height: '2em !important',
            display: 'inline-block !important',
            fontSize: '17px !important',
            transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms !important',
            'user-select': 'none !important',
            flexShrink: 0,
        },
        info: {
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 24,
            marginTop: 80,
            '& > p': {
                padding: 10,
                backgroundColor: '#aed6ff36',
                borderRadius: 8,
                fontSize: 12,
            },
        },
        heartSymbol: {
            color: 'red',
        },
        bottomNavigation: {
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#FFF',
            boxShadow: "rgba(0, 0, 0, .08) 4px 8px 30px 12px",
            padding: "0 18px",
            zIndex: 1000,
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
        },
        navigationPane: {
            display: "flex",
            gap: "2px",
            justifyContent: "space-around",
            alignItems: "center",
            color: "black",
            fontSize: "24px",
            height: "80px",
            position: "relative",
            [theme.breakpoints.up('sm')]: {
                height: "80px",
            },
        },
        hoverline: {
            position: "absolute",
            height: "2px",
            top: "0",
            transition: "all 0.15s ease-in-out",
            backgroundColor: "#469AD0",
        },
        bottomNavigationButton: {
            transition: "all 0.15s ease-in-out",
            cursor: "pointer",
            flex: 1,
            background: "white !important",
        },
        bottomNavigationMainButton: {
            position: "absolute",
            top: "-45px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "#FFF",
            padding: "10px",
            [theme.breakpoints.up('sm')]: {
                height: "90px",
                width: "90px",
                top: "-50px",
            },
        },
        primaryButton: {
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            backgroundColor: "#469AD0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
        },
    }),
);
