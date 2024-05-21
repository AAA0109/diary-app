import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography, styled } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setHeaderTitle, setNavigationStep } from 'redux/actions/globalActions';
import useAuth from 'hooks/useAuth';
import Header from 'components/header/Header';
import FamilyInfoForm from './FamilyInfoForm';
import CustomNameForm from './CustomNameForm';


export default function FamilySettings() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        dispatch<any>(setHeaderTitle("Family Settings"));
        dispatch<any>(setNavigationStep(1));
    }, []);

    const canEdit = user?.role === 'Parent' || user?.role === 'Admin';

    return (
        <RootStyle>
            <Header />
            {canEdit && <FamilyInfoForm />}
            <CustomNameForm />
        </RootStyle>
    );
}

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
    padding: "24px 12px",
    margin: "0 auto",
    position: 'relative',
}));

const FamilyName = styled(Typography)(() => ({
    fontSize: 18,
    fontWeight: 600,
    color: "#000",
}))

const FamilyDescription = styled(Typography)(() => ({
    fontSize: 12,
    fontWeight: 400,
    color: "#26282C90",
}))
