import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, CircularProgress, Typography, styled } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setHeaderTitle, setNavigationStep } from 'redux/actions/globalActions';
import FamilyAvatar from 'components/FamilyAvatar';
import useAuth from 'hooks/useAuth';
import SettingsIcon from 'components/icons/SettingsIcon';
import { FamilyMotoPane } from 'components/familyMoto';
import Header from 'components/header/Header';
import { FamilyMoto } from 'core/domain/family/familyMoto';
import FamilyMotoItem from 'components/familyMoto/motoItem';

export default function AllMotos() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { user, getFamilyMotos } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [motolist, setMotolist] = useState<FamilyMoto[]>([]);

    useEffect(() => {
        dispatch<any>(setHeaderTitle("All Weekly Goals"));
        dispatch<any>(setNavigationStep(1));
        if (!user?.family) {
            enqueueSnackbar('You have not joined any family yet', { variant: 'warning' });
            navigate('/');
        }
        fetchFamilyMotos();
    }, []);

    const fetchFamilyMotos = async () => {
        setLoading(true);
        const res = await getFamilyMotos();
        if (res) {
            setMotolist(res.motos);
        }
        setLoading(false);
    }

    const canEdit = user?.role === 'Parent' || user?.role === 'Admin';

    return (
        <RootStyle>
            <Header />
            {loading && (
                <Box display='flex' justifyContent='center' alignItems='center' height='100vh'>
                    <CircularProgress />
                </Box>
            )}
            {motolist.map((moto, index) => (
                <FamilyMotoItem moto={moto} key={index} updateMotos={fetchFamilyMotos} canEdit={canEdit} />
            ))}
            {motolist.length === 0 && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                        No Weekly Goals yet
                    </Typography>
                </Box>
            )}
        </RootStyle>
    );
}

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
    padding: "24px 12px",
    margin: "0 auto",
    position: 'relative',
}));