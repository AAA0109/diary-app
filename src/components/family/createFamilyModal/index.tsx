/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { createStyles, makeStyles, styled } from '@mui/styles';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText, FormLabel, IconButton, TextField, Typography } from '@mui/material';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { TextareaAutosize } from '@mui/base';
import { Theme } from '@mui/material/styles';
import useAuth from 'hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { PATH_MAIN } from 'routes/paths';

import { ICreateFamilyModalProps } from './ICreateFamilyModalProps';

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

const BootstrapTextarea = styled(TextareaAutosize)(({ theme }) => ({
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '8px',
    resize: 'none',
    width: '100%',
    fontSize: '16px',
    padding: '16px',
    color: '#212B36',
}));

const BootstrapFormLabel = styled(FormLabel)(({ theme }) => ({
    color: '#000000',
    margin: '8px 0',
    display: 'block',
}));

const BootstrapTextField = styled(TextField)(({ theme }) => ({
    display: 'block',
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

export function CreateFamilyModal(props: ICreateFamilyModalProps) {
    const classes = useStyles();
    const { t } = useTranslation();
    const { createFamily, user } = useAuth();
    const navigate = useNavigate();

    const { style } = props;

    const [familyName, setFamilyName] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        props.handleClose();
    }

    const handleSubmit = async () => {
        try {
            if (!validate()) return;
            setIsLoading(true);
            const { errors } = await createFamily(user?.id!, familyName, description);
            setIsLoading(false);
            if (errors) {
                setErrors(errors);
            }
            else {
                setErrors([]);
                navigate(PATH_MAIN.root);
            }
        }
        catch (e) {
            setErrors(["Action Failed"]);
            setIsLoading(false);
        }
    }

    const validate = () => {
        const temp: string[] = [];
        let isValid = true;
        if (!familyName) {
            temp.push('Family name is required');
            isValid = false;
        }
        if (!description) {
            temp.push('Description is required');
            isValid = false;
        }
        setErrors(temp);
        return isValid;
    }

    const handleChangeFamilyName = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setFamilyName(e.target.value);
    }

    const handleChangeDescription = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setDescription(e.target.value);
    }

    useEffect(() => {
        if (errors.length > 0) {
            validate();
        }
    }, [familyName, description])

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                Create your family
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
                    Family Name
                </BootstrapFormLabel>
                <BootstrapTextField placeholder={`${props.user.displayName}'s family`} disabled={isLoading} onChange={handleChangeFamilyName}>
                    {familyName}
                </BootstrapTextField>
                <BootstrapFormLabel>
                    Description
                </BootstrapFormLabel>
                <BootstrapTextarea minRows="5" disabled={isLoading} onChange={handleChangeDescription} />
            </DialogContent>
            <DialogActions>
                <BootstrapButton onClick={handleSubmit} variant='contained' disabled={isLoading}>
                    Create
                </BootstrapButton>
            </DialogActions>
        </BootstrapDialog>
    );
}

export default CreateFamilyModal;
