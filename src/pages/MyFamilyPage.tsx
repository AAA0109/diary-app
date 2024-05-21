import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { Box, Button, Grid, IconButton, TextField, TextareaAutosize, Theme, styled } from '@mui/material';
import classNames from 'classnames';
import { createStyles, makeStyles } from '@mui/styles';
import useAuth from 'hooks/useAuth';
import { CloseRounded, CreateRounded, PersonAdd } from '@mui/icons-material';
import { DBUser } from 'core/domain/users/dbUser';
import UserAvatar from 'components/UserAvatar';
import { useSnackbar } from 'notistack';
import { isEqual } from 'lodash';
import AddMemberModal from 'components/family/addMemberModal';

const BootstrapTextField = styled(TextField)(({ theme }) => ({
    display: 'block',
    '& .MuiOutlinedInput-root': {
        width: '100%',
    }
}));

const BootstrapTextarea = styled(TextareaAutosize)(({ theme }) => ({
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '8px',
    resize: 'none',
    width: '100%',
    fontSize: '16px',
    padding: '16px',
    color: '#212B36',
    margin: '8px 0',
}));

const BootstrapButton = styled(Button)(({ theme }) => ({
    padding: '8px 24px',
    fontSize: '12px',
    margin: '6px',
}));

const RoundedButton = styled(Button)(({ theme }) => ({
    padding: '4px 8px',
    fontSize: '12px',
    margin: '6px',
    borderRadius: '32px',
}));

export function MyFamilyPage() {
    const navigate = useNavigate();
    const { user, updateFamily, getMembers } = useAuth();
    const family = user?.family;
    const classes = useStyles();
    const [editFamily, setEditFamily] = useState(false);
    const [editSubmitting, setEditSubmitting] = useState(false);
    const [familyName, setFamilyName] = useState(family?.name);
    const [description, setDescription] = useState('');
    const [memberList, setMemberList] = useState<DBUser[]>([]);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [openAddMemberModal, setOpenAddMemberModal] = useState(true);

    useEffect(() => {
        if (family) {
            setFamilyName(family.name);
            setDescription(family.description);
        }
    }, [family]);

    useEffect(() => {
        getFamilyMembers();
    }, [])

    const getFamilyMembers = async () => {
        const { members } = await getMembers();
        console.log(members);
        setMemberList(members);
    }

    const handleChangeFamilyName = (e: any) => {
        setFamilyName(e.target.value);
    }

    const handleChangeDescription = (e: any) => {
        setDescription(e.target.value);
    }

    const handleEditFamily = async () => {
        setEditSubmitting(true);
        try {
            await updateFamily(family?.id!, familyName!, description);
            setEditFamily(false);
        } catch (error) {
            console.log(error);
        } finally {
            setEditSubmitting(false);
        }
    }

    const handleAddMember = () => {
        setOpenAddMemberModal(true);
    }

    const handleEditFamilyMission = () => {
        enqueueSnackbar('Not implemented yet', {
            variant: 'warning',
            action: (key) => (
                <IconButton size="small" onClick={() => closeSnackbar(key)}>
                    <CloseRounded />
                </IconButton>
            ),
        });
    }

    

    return (
        <Grid container justifyContent="space-around" spacing={3}>
            <Grid className={classNames(classes.gridItem, classes.postGrid)} xs={12} md={8} item>
                <Box className={classes.welcomePane}>
                    My Family
                </Box>
                <Box marginY="8px" marginBottom="24px">
                    {!editFamily ? (
                        <Box>
                            <Box display="flex" alignItems="center">
                                <Typography className={classes.familyName}>
                                    {family?.name}
                                </Typography>
                                <CreateRounded color='primary' className={classes.editIcon} onClick={() => setEditFamily(true)} />
                            </Box>
                            <Typography className={classes.familyDescription}>
                                {family?.description}
                            </Typography>
                        </Box>
                    ) :
                        <>
                            <BootstrapTextField placeholder="Team Name" disabled={editSubmitting} onChange={handleChangeFamilyName} value={familyName} />
                            <BootstrapTextarea minRows="5" disabled={editSubmitting} onChange={handleChangeDescription} value={description} />
                            <Box display="flex" justifyContent="flex-end">
                                <BootstrapButton variant="outlined" color="primary" onClick={() => setEditFamily(false)} disabled={editSubmitting}>
                                    Cancel
                                </BootstrapButton>
                                <BootstrapButton variant="contained" color="primary" onClick={handleEditFamily} disabled={editSubmitting}>
                                    Save
                                </BootstrapButton>
                            </Box>
                        </>
                    }
                </Box>
                <Box marginY="8px" marginBottom="24px">
                    <Box display="flex" alignItems="center">
                        <Typography className={classes.familyName}>
                            Family Members
                        </Typography>
                        <PersonAdd color='primary' className={classes.editIcon} onClick={handleAddMember} />
                    </Box>
                    <Box className={classes.memberListPane}>
                        {memberList.map((member, index) => isEqual(member.id, user?.id) ? null : (
                            <Box className={classes.memberPane} key={index}>
                                <UserAvatar size={32} user={member} />
                                <Box marginLeft="16px" flex={1}>
                                    <Typography>
                                        {member.fullName}
                                    </Typography>
                                </Box>
                                <RoundedButton variant="contained" color="primary">
                                    View
                                </RoundedButton>
                            </Box>
                        ))}
                        {memberList.length < 2 && (
                            <Box className={classes.emptyMemberPane}>
                                No family yet
                            </Box>
                        )}
                    </Box>
                    <AddMemberModal family={family!} open={openAddMemberModal} handleClose={() => setOpenAddMemberModal(false)} />
                </Box>
                <Box marginY="8px" marginBottom="24px">
                    <Box display="flex" alignItems="center">
                        <Typography className={classes.familyName}>
                            Weekly Family Mission
                        </Typography>
                        <CreateRounded color='primary' className={classes.editIcon} onClick={handleEditFamilyMission} />
                    </Box>
                    <Typography className={classes.familyDescription}>
                        Each day , commit to spending at least one hour outside together.
                    </Typography>
                </Box>
            </Grid>
        </Grid>
    );
}

export default MyFamilyPage;


export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        gridItem: {
            padding: '24px !important',
            paddingLeft: '42px !important',
        },
        postGrid: {
            width: '100%',
        },
        welcomePane: {
            padding: "20px 0",
            fontSize: "24px",
            fontWeight: "bold",
        },
        familyName: {
            fontSize: "15px",
            fontWeight: "bold",
        },
        editIcon: {
            marginLeft: "10px",
            cursor: "pointer",
        },
        familyDescription: {
            margin: "10px 0",
        },
        memberListPane: {
            margin: "8px 0",
        },
        memberPane: {
            display: "flex",
            alignItems: "center",
            padding: "8px 0",
            borderBottom: "1px solid #E0E0E0",
        },
        emptyMemberPane: {
            padding: "20px 0",
            textAlign: "center",
            borderBottom: "1px solid #E0E0E0",
        }
    }),
);
