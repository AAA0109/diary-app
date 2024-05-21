/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { createStyles, makeStyles, styled } from '@mui/styles';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, FormControl, RadioGroup, FormControlLabel, Radio, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { Theme } from '@mui/material/styles';
import * as Yup from 'yup';

import { IEditFamilyMotoModalProps } from './IEditFamilyMotoModalProps';
import RetryIcon from 'components/icons/RetryIcon';
import { useSnackbar } from 'notistack';
import { Form, FormikProvider, useFormik } from 'formik';
import useIsMountedRef from 'hooks/useIsMountedRef';
import useAuth from 'hooks/useAuth';

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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '240px',
            minWidth: '240px',
            height: '320px',
            margin: '10px',
            position: 'relative',
        },
        group: {
            margin: `${theme.spacing(1)}px 0`,
        },
        formControl: {
            width: '100%',
            margin: '8px 0',
        },
        permissionItem: {
            fontSize: 15,
        },
    }),
);

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

export function EditFamilyMoto(props: IEditFamilyMotoModalProps) {
    const classes = useStyles();
    const { t } = useTranslation();

    const isMountedRef = useIsMountedRef();

    const { editFamilyMoto } = useAuth();

    const EditMotoSchema = Yup.object().shape({
        motiveHeading: Yup.string().required('Motive Heading is required'),
        motiveDescription: Yup.string().required('Motive Description is required'),
    });

    const formik = useFormik({
        initialValues: {
            motiveHeading: props.moto.name,
            motiveDescription: props.moto.description,
        },
        validationSchema: EditMotoSchema,
        onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
            try {
                const res = await editFamilyMoto(props.moto.id, values.motiveHeading, values.motiveDescription);
                props.updateCurrentMoto();
                props.handleClose();
                enqueueSnackbar('Moto is updated successfully', {
                    variant: 'success',
                    action: (key) => (
                        <IconButton size="small" onClick={() => closeSnackbar(key)}>
                            <CloseIcon />
                        </IconButton>
                    ),
                });
                if (isMountedRef.current) {
                    setSubmitting(false);
                }
            } catch (error: any) {
                // eslint-disable-next-line no-console
                console.error(error);
                enqueueSnackbar(error.message, { variant: 'error' });
                resetForm();
                if (isMountedRef.current) {
                    setSubmitting(false);
                    const errors = { afterSubmit: error.message };
                    setStatus(errors);
                }
            }
        },
    });

    const { errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

    useEffect(() => {
        setFieldValue('motiveHeading', props.moto.name);
        setFieldValue('motiveDescription', props.moto.description);
    }, [props.moto])

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleClose = () => {
        props.handleClose();
    }

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                Create New Moto
                <Typography fontSize="14px" fontWeight="400" paddingY="4px">
                    Create new moto for your family
                </Typography>
            </BootstrapDialogTitle>
            <FormikProvider value={formik}>
                <FormStyle autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <DialogContent>
                        <FormControl component="div" required className={classes.formControl}>
                            <AuthTextField
                                fullWidth
                                type="text"
                                placeholder="Motive Heading"
                                {...getFieldProps('motiveHeading')}
                                error={Boolean(touched.motiveHeading && errors.motiveHeading)}
                                helperText={touched.motiveHeading && errors.motiveHeading}
                                tabIndex={1}
                            />
                        </FormControl>
                        <FormControl component="div" required className={classes.formControl}>
                            <AuthTextArea
                                fullWidth
                                type='text'
                                multiline
                                rows={3}
                                placeholder="Motive Description"
                                {...getFieldProps('motiveDescription')}
                                error={Boolean(touched.motiveDescription && errors.motiveDescription)}
                                helperText={touched.motiveDescription && errors.motiveDescription}
                                tabIndex={2}
                            />
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <ActionGroup>
                            <BootstrapButton type='submit' variant='contained' disabled={isSubmitting}>
                                Save & Update
                            </BootstrapButton>
                        </ActionGroup>
                    </DialogActions>
                </FormStyle>
            </FormikProvider>
        </BootstrapDialog>
    );
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
    width: '100%',
    margin: '6px',
    padding: "16px 0",
    fontSize: "18px",
    fontWeight: 700,
    borderRadius: 18,
    fontFamily: 'Montserrat',
}));

const AuthTextField = styled(TextField)(() => ({
    '& input': {
        "&:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 100px #F5FAFC inset !important",
            WebkitTextFillColor: "default",
        },
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: 12,
        padding: "2px 12px",
        backgroundColor: '#F5FAFC !important',
        '& fieldset': {
            borderColor: 'transparent !important',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#469AD0 !important',
        },
        '&.Mui-focused svg': {
            color: "#469AD0 !important",
        },
    },
}));

const AuthTextArea = styled(TextField)(() => ({
    '& textarea': {
        lineHeight: 2,
        padding: "16px 12px",
        "&:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 100px #F5FAFC inset !important",
            WebkitTextFillColor: "default",
        },
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: 12,
        padding: "2px 12px",
        backgroundColor: '#F5FAFC !important',
        '& fieldset': {
            borderColor: 'transparent !important',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#469AD0 !important',
        },
        '&.Mui-focused svg': {
            color: "#469AD0 !important",
        },
    },
}));

const ActionGroup = styled(Box)(({ theme }) => ({
    width: '100%',
}))

const FormStyle = styled(Form)(() => ({
    textAlign: 'center',
    display: 'block',
    margin: 'auto',
}));

export default EditFamilyMoto;
