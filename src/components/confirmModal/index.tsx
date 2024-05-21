/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { createStyles, makeStyles, styled } from '@mui/styles';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { Theme } from '@mui/material/styles';

import { IConfirmModalProps } from './IConfirmModalProps';
import { useSnackbar } from 'notistack';
import { DeleteForever } from '@mui/icons-material';

const BootstrapDialog = styled(Dialog)(({ theme }: { theme: Theme }) => ({
    '& .MuiPaper-root': {
        width: '640px',
        margin: '16px',
        [theme.breakpoints.down('xs')]: {
            width: '100%',
        },
    },
    '& .MuiDialogContent-root': {
        padding: 16,
    },
    '& .MuiDialogActions-root': {
        padding: "8px 16px",
    },
}));

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2, pb: 0, }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 16,
                        top: 16,
                        background: '#F6FAFD',
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon color='primary' />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

const BootstrapButton = styled(Button)(({ theme }) => ({
    width: '100px',
    margin: '6px',
    padding: "8px 0",
    fontSize: "14px",
    fontWeight: 700,
    borderRadius: 12,
    fontFamily: 'Montserrat',
}));

const ActionGroup = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    justifyContent: 'end',
}))

export function ConfirmModal(props: IConfirmModalProps) {
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleClose = () => {
        props.handleClose();
    }

    const handleConfirm = async () => {
        if (await props.handleConfirm()) {
            props.handleClose();
        }
    }

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                {props.title ?? 'Confirm Delete'}
            </BootstrapDialogTitle>
            <DialogContent>
                {props.content ?? 'Are you sure you want to delete this item?'}
            </DialogContent>
            <DialogActions>
                <ActionGroup>
                    <BootstrapButton onClick={handleClose} variant='contained'>
                        {props.cancelText ? props.cancelText : 'Cancel'}
                    </BootstrapButton>
                    <BootstrapButton onClick={handleConfirm} variant='contained' color={props.confirmColor ?? 'error'} disabled={isLoading}>
                        {props.confirmIcon && props.confirmIcon}
                        {props.confirmText ?? 'Delete'}
                    </BootstrapButton>
                </ActionGroup>
            </DialogActions>
        </BootstrapDialog>
    );
}

export default ConfirmModal;
