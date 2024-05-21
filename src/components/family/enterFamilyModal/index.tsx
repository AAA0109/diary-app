/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { createStyles, makeStyles, styled } from '@mui/styles';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Collapse, FormLabel, IconButton, TextField, Typography, Card } from '@mui/material';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { TextareaAutosize } from '@mui/base';
import { Theme } from '@mui/material/styles';
import useAuth from 'hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { PATH_MAIN } from 'routes/paths';
import { debounce } from 'lodash';
import { Family } from 'core/domain/family/family';
import UserAvatar from 'components/UserAvatar';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

import { IEnterFamilyModalProps } from './IEnterFamilyModalProps';

const BootstrapDialog = styled(Dialog)(({ theme }: { theme: Theme }) => ({
    '& .MuiPaper-root': {
        width: '640px',
        [theme.breakpoints.down('xs')]: {
            width: '100%',
        },
    },
    '& .MuiDialogContent-root': {
        padding: 16,
    },
    '& .MuiDialogActions-root': {
        padding: 8,
    },
}));

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: '240px',
            minWidth: '240px',
            height: '320px',
            margin: '10px',
            position: 'relative',
        },
    }),
);

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

const BootstrapFormLabel = styled(FormLabel)(({ theme }) => ({
    color: '#000000',
    margin: '8px 0',
    display: 'block',
}));

const BootstrapTextField = styled(TextField)(({ theme }) => ({
    display: 'block',
    marginBottom: '16px',
    '& .MuiOutlinedInput-root': {
        width: '100%',
    }
}));

const BootstrapButton = styled(Button)(({ theme }) => ({
    padding: '8px 24px',
    fontSize: '12px',
    margin: '6px',
}));

const ErrorPane = styled(Box)(({ theme }) => ({
    padding: '8px 24px',
    border: '1px solid #FF4842',
    borderRadius: '16px',
    margin: '6px',
    opacity: 0.8,
}));

const FamilyListPane = styled(Box)(({ theme }) => ({
    margin: '16px 0',
    marginBottom: '36px !important',
}));

const FamilyPane = styled(Card)(({ theme }) => ({
    padding: '12px 24px',
    width: '100% !important',
}));

const FamilyName = styled(Typography)(({ theme }) => ({
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    flexGrow: 1,
}));

const JoinButton = styled(Button)(({ theme }) => ({
    fontSize: '12px',
    margin: '0 6px',
    color: '#FFFFFF',
    padding: '4px 8px',
}));

const ShowMoreIcon = styled(ExpandMore)(({ theme }) => ({
    margin: '0 4px',
    fontSize: '24px',
    cursor: 'pointer',
}));

const ShowLessIcon = styled(ExpandLess)(({ theme }) => ({
    margin: '0 4px',
    fontSize: '24px',
    cursor: 'pointer',
}));

const MemberPane = styled(Box)(({ theme }) => ({
    margin: '8px 0',
    display: 'flex',
    alignItems: 'center',
}));

const MemberName = styled(Typography)(({ theme }) => ({
    margin: '0 8px',
}));

const NoMatching = styled(Typography)(({ theme }) => ({
    margin: '25px auto',
    textAlign: 'center',
}));

export function EnterFamilyModal(props: IEnterFamilyModalProps) {
    const classes = useStyles();
    const { t } = useTranslation();
    const { findFamily, enterFamily, user } = useAuth();
    const navigate = useNavigate();

    const { style } = props;

    const [searchKey, setSearchKey] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [familyList, setFamilyList] = useState<Family[]>([]);
    const [isOpenCollapse, setIsOpenCollapse] = useState({} as { [key: string]: boolean });

    const handleClose = () => {
        props.handleClose();
    }

    const handleSubmit = async (id: string) => {
        try {
            setIsLoading(true);
            console.log(user)
            const { error } = await enterFamily(id, user?.id!);
            if (!error) {
                navigate(PATH_MAIN.root);
            }
            else {
                setErrors(["Action Failed"]);
            }
            setIsLoading(false);
        }
        catch (e) {
            setErrors(["Action Failed"]);
            setIsLoading(false);
        }
    }

    const handleSearch = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        handleChangeWithLib(e.target.value);
    }

    const handleChangeWithLib = debounce(async (value) => {
        const { familyList } = await findFamily(value);
        setFamilyList(familyList);
    }, 500);

    const handleCollapse = (id: string) => {
        setIsOpenCollapse({
            ...isOpenCollapse,
            [id]: !isOpenCollapse?.[id],
        });
    }

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                Find your family
            </BootstrapDialogTitle>
            <DialogContent dividers>
                {errors.length > 0 && <ErrorPane color='error'>
                    {errors.map((e, i) => (
                        <Typography key={i} variant='body1' color='error'>
                            * {e}
                        </Typography>
                    ))}
                </ErrorPane>}
                <BootstrapFormLabel>
                    Search Family
                </BootstrapFormLabel>
                <BootstrapTextField placeholder="search with your family member's name" disabled={isLoading} onChange={handleSearch}>
                    {searchKey}
                </BootstrapTextField>
                <BootstrapFormLabel>
                    Family List
                </BootstrapFormLabel>
                {familyList.length > 0 && <FamilyListPane>
                    {familyList.map((e) => (
                        <FamilyPane>
                            <Box display="flex" alignItems="center" marginY="4px">
                                {isOpenCollapse?.[e.id] ? <ShowLessIcon onClick={() => handleCollapse(e.id)} /> : <ShowMoreIcon onClick={() => handleCollapse(e.id)} />}
                                <FamilyName onClick={() => handleCollapse(e.id)}>
                                    {e.name}
                                </FamilyName>
                                <JoinButton onClick={() => handleSubmit(e.id)} variant='contained' disabled={isLoading} color='success'>
                                    Join
                                </JoinButton>
                            </Box>
                            <Collapse in={isOpenCollapse?.[e.id]}>
                                {e.members?.map((m, i) => (
                                    <MemberPane>
                                        <UserAvatar user={m} size={32} marginRight="4px" />
                                        <MemberName>
                                            {m.fullName}
                                        </MemberName>
                                    </MemberPane>
                                ))}
                            </Collapse>
                        </FamilyPane>
                    ))}
                </FamilyListPane>}
                {familyList.length === 0 && <NoMatching variant='h3'>
                    No Matching Family
                </NoMatching>}
                <Collapse>
                    setsets
                </Collapse>
            </DialogContent>
            <DialogActions>
                <BootstrapButton onClick={handleClose} variant='outlined' disabled={isLoading}>
                    Back
                </BootstrapButton>
            </DialogActions>
        </BootstrapDialog>
    );
}

export default EnterFamilyModal;
