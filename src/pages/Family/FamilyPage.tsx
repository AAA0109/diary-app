import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, IconButton, Menu, MenuItem, Typography, styled } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setNavigationStep } from 'redux/actions/globalActions';
import FamilyAvatar from 'components/FamilyAvatar';
import useAuth from 'hooks/useAuth';
import SettingsIcon from 'components/icons/SettingsIcon';
import { FamilyMotoPane } from 'components/familyMoto';
import { AddRounded, MoreHoriz } from '@mui/icons-material';
import FamilyMemberItem from 'components/familyMembers/memberItem';
import { PATH_MAIN } from 'routes/paths';

export default function FamilyPage() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        dispatch<any>(setNavigationStep(1));
        if (!user?.family) {
            enqueueSnackbar('You have not joined any family yet', { variant: 'warning' });
            navigate('/');
        }
    }, []);

    const goToFamilySettingPage = () => {
        navigate(PATH_MAIN.family.settings);
    }

    const goToInviteMemberpage = () => {
        navigate(PATH_MAIN.family.addMember);
    }

    const canEdit = user?.role === 'Parent' || user?.role === 'Admin';

    return (
        <RootStyle>
            <FamilyHeader>
                <FamilyHeaderTitle>
                    <FamilyAvatar family={user?.family!} sx={{ width: 60, height: 60 }} />
                    <Box>
                        <FamilyName>
                            {user?.family?.name}
                        </FamilyName>
                        <FamilyDescription>
                            {user?.family?.description}
                        </FamilyDescription>
                    </Box>
                </FamilyHeaderTitle>
                <SettingsIcon onClick={goToFamilySettingPage} style={{ cursor: 'pointer' }} />
            </FamilyHeader>
            <FamilyMotoPane canEdit={canEdit} />
            <FamilyMembersHeader>
                <FamilyMembersTitle>
                    Family Members
                </FamilyMembersTitle>
                {canEdit && <AddButton onClick={goToInviteMemberpage}>
                    <AddIcon>
                        <AddRounded />
                    </AddIcon>
                    Add
                </AddButton>}
            </FamilyMembersHeader>
            <FamilyMemberList>
                {user?.family?.members?.filter(m => m.id?.toString() !== user.id?.toString())?.map((member, index) => (
                    <FamilyMemberItem key={index} member={member} />
                ))}
            </FamilyMemberList>
        </RootStyle>
    );
}

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
    padding: "24px 12px",
    margin: "0 auto",
    position: 'relative',
}));

const FamilyHeader = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    margin: "10px 0",
}))

const FamilyHeaderTitle = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
}))

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

const FamilyMembersHeader = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    margin: "10px 0",
    marginTop: 30,
}))

const FamilyMembersTitle = styled(Typography)(() => ({
    fontSize: 16,
    fontWeight: 500,
    color: "#26282C",
}))

const AddButton = styled(Button)(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: '#26282C90',
    fontSize: 16,
    fontWeight: 500,
}))

const AddIcon = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: '50%',
    background: '#469AD0',
    color: 'white',
    '& svg': {
        width: '16px',
        height: '16px',
    }
}))

const FamilyMemberList = styled('div')(() => ({
    margin: "10px 0",
}))
