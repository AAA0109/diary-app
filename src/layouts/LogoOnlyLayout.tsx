import React from 'react';
import { Link as RouterLink, Outlet } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
// components

import Logo from '../assets/images/logo.png';
import { useStyles } from 'containers/home/homeStyles';

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(3, 3, 0),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(5, 5, 0),
    },
}));

// ----------------------------------------------------------------------

export default function LogoOnlyLayout() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <HeaderStyle>
                <RouterLink to="/">
                    <img src={Logo} alt="logo" height="72px" width="auto" />
                </RouterLink>
            </HeaderStyle>
            <Outlet />
        </div>
    );
}
