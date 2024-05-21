/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { createStyles, makeStyles, styled } from '@mui/styles';
import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, FormControl, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { Theme } from '@mui/material/styles';
import * as Yup from 'yup';

import { useSnackbar } from 'notistack';
import { Form, FormikProvider, useFormik } from 'formik';
import useIsMountedRef from 'hooks/useIsMountedRef';
import useAuth from 'hooks/useAuth';

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

export function CustomNameForm() {
    const classes = useStyles();
    const { t } = useTranslation();
    const { user, updateProfile } = useAuth();

    const isMountedRef = useIsMountedRef();

    const CustomNameSchema = Yup.object().shape({
        customName: Yup.string().required('Nick Name is required'),
    });

    const formik = useFormik({
        initialValues: {
            customName: user?.customName,
        },
        validationSchema: CustomNameSchema,
        onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
            try {
                const res = await updateProfile({ customName: values.customName });
                enqueueSnackbar('Nick name is updated successfully', {
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

    const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    return (
        <RootStyle>
            <FormikProvider value={formik}>
                <FormTitle>
                    Nickname in Family
                </FormTitle>
                <FormStyle autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <FormControl component="div" required className={classes.formControl}>
                        <AuthTextField
                            fullWidth
                            type="text"
                            placeholder="ex: Father, Mother, Son, Daughter, ..."
                            {...getFieldProps('customName')}
                            error={Boolean(touched.customName && errors.customName)}
                            helperText={touched.customName && errors.customName}
                            tabIndex={1}
                        />
                    </FormControl>
                    <ActionGroup>
                        <BootstrapButton type='submit' variant='contained' disabled={isSubmitting}>
                            Save
                        </BootstrapButton>
                    </ActionGroup>
                </FormStyle>
            </FormikProvider>
        </RootStyle>
    );
}

const RootStyle = styled('div')(() => ({
    padding: "24px 0",
    borderBottom: '1px solid #E4E4E4',
}))

const BootstrapButton = styled(Button)(({ theme }) => ({
    padding: "4px 16px",
    fontSize: "16px",
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
    display: 'flex',
    justifyContent: 'end',
    marginTop: 12,
}))

const FormStyle = styled(Form)(() => ({
    textAlign: 'center',
    display: 'block',
    margin: 'auto',
}));

const FormTitle = styled('h2')(() => ({
    fontSize: 14,
    fontWeight: 600,
    color: "#000",
    textAlign: 'left',
}))

export default CustomNameForm;
