import { useEffect, useState } from 'react';
import AuthWrapper from 'containers/authWrapper';
import useAuth from 'hooks/useAuth';
import { Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router';
import { PATH_MAIN } from 'routes/paths';
import { AddRounded, GroupsRounded } from '@mui/icons-material'
import CreateFamilyModal from 'components/family/createFamilyModal';
import EnterFamilyModal from 'components/family/enterFamilyModal';

export default function CreateFamilyPage() {

    const { user } = useAuth();
    const navigate = useNavigate();
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openEnterModal, setOpenEnterModal] = useState(false);

    useEffect(() => {
        console.log(user?.family, "family")
        if (user?.family) {
            navigate(PATH_MAIN.root);
        }
    }, [user]);

    const RootContainer = styled('div')(({ theme }) => ({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '20px',
        gap: '20px',
        height: '100%',
        backgroundColor: '#F5F5F5',
    }));

    const CardButton = styled('div')(({ theme }) => ({
        padding: '20px 36px',
        borderRadius: '16px',
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
        transition: 'all .3s',
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #EFEFEF',
        cursor: 'pointer',
        '&:hover': {
            transform: 'scale(1.1)',
        },
    }));

    const AddIcon = styled(AddRounded)(({ theme }) => ({
        fontSize: '40px',
    }));

    const GroupIcon = styled(GroupsRounded)(({ theme }) => ({
        fontSize: '40px',
    }));

    const handleOpenCreateModal = () => {
        setOpenCreateModal(true);
    }

    const handleOpenEnterModal = () => {
        setOpenEnterModal(true);
    }

    return (
        <AuthWrapper>
            <RootContainer>
                <CardButton onClick={handleOpenCreateModal}>
                    <AddIcon color='primary' />
                    <Typography variant='h3' color='primary' sx={{ ml: 1 }}>Create Your Family</Typography>
                </CardButton>
                <CardButton onClick={handleOpenEnterModal}>
                    <GroupIcon color='primary' />
                    <Typography variant='h3' color='primary' sx={{ ml: 1 }}>Find Your Family</Typography>
                </CardButton>
            </RootContainer>
            <CreateFamilyModal open={openCreateModal} handleClose={() => setOpenCreateModal(false)} user={user!} />
            <EnterFamilyModal open={openEnterModal} handleClose={() => setOpenEnterModal(false)} user={user!} />
        </AuthWrapper>
    );
}
