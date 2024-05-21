import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';

//
import { useNavigate, useSearchParams } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/CloseRounded';
import useAuth from 'hooks/useAuth';
import useIsMountedRef from 'hooks/useIsMountedRef';
import { useSnackbar } from 'notistack';
import useLocales from 'hooks/useLocales';
import { PATH_AUTH, PATH_PAGE } from 'routes/paths';
import { Box, InputAdornment, Stack, Typography } from '@mui/material';
import PasswordIcon from 'components/icons/PasswordIcon';

// ----------------------------------------------------------------------

const FormStyle = styled(Form)(({ theme }) => ({
    textAlign: 'center',
    display: 'block',
    margin: 'auto',
    height: 'calc(100% - 120px)',
    [theme.breakpoints.down('sm')]: {
        height: 'calc(100% - 100px)',
    },
}));

const FormRootStyle = styled('div')(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
}));

const ButtonBoxStyle = styled('div')(({ theme }) => ({
    margin: 0,
    border: 0,
    display: 'inline-flex',
    padding: 0,
    position: 'relative',
    minWidth: 0,
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
        marginTop: '60px',
    },
}));

const WrapperButtonStyle = styled('div')(({ theme }) => ({
    position: 'relative',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        maxWidth: 400,
        minWidth: 320,
    },
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

export default function ChangePasswordForm() {
    const { changePassword, verifyPasswordToken } = useAuth();
    const { t } = useLocales();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        verifyToken();
    }, []);

    const verifyToken = async () => {
        const token = searchParams.get("token");
        if (token) {
            const res = await verifyPasswordToken(token);
            if (!res?.success) {
                enqueueSnackbar(res?.error, {
                    variant: 'error',
                    action: (key) => (
                        <IconButton size="small" onClick={() => closeSnackbar(key)}>
                            <CloseIcon />
                        </IconButton>
                    ),
                });
                navigate(PATH_AUTH.resetPassword);
            }
        }
        else {
            navigate(PATH_AUTH.resetPassword);
        }
    }

    const ResetPasswordSchema = Yup.object().shape({
        password: Yup.string()
            .min(8, t('signup.inputTooShort'))
            .required(t('signup.passwordRequired')),
        passwordConfirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], t('signup.confirmEqualPasswordError')),
    });

    const formik = useFormik({
        initialValues: {
            password: '',
            passwordConfirmation: '',
        },
        validationSchema: ResetPasswordSchema,
        onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
            try {
                const token = searchParams.get("token");
                const res = await changePassword(values.password, token!);
                if (res.success) {
                    enqueueSnackbar('Password was changed correctly.', {
                        variant: 'success',
                        action: (key) => (
                            <IconButton size="small" onClick={() => closeSnackbar(key)}>
                                <CloseIcon />
                            </IconButton>
                        ),
                    });
                    navigate(PATH_AUTH.login);
                }
                else {
                    enqueueSnackbar(res.error, {
                        variant: 'error',
                        action: (key) => (
                            <IconButton size="small" onClick={() => closeSnackbar(key)}>
                                <CloseIcon />
                            </IconButton>
                        ),
                    });
                }
                if (isMountedRef.current) {
                    setSubmitting(false);
                }
            } catch (error: any) {
                // eslint-disable-next-line no-console
                console.error(error);
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

    return (
        <FormikProvider value={formik}>
            <FormStyle autoComplete="off" noValidate onSubmit={handleSubmit}>
                <FormRootStyle>
                    <Box>
                        <Typography fontWeight="400" fontSize="26px" textAlign="left">
                            Forget <span style={{ color: '#469AD0', fontWeight: 600, }} >Password</span><span style={{ fontWeight: 600, }}>!</span>
                        </Typography>
                        <Typography color="#6F8592" fontWeight="300" fontSize="400" textAlign="left" paddingY="8px" marginBottom="12px">
                            Recover your account using your register email address <span style={{ color: "#469AD0", fontWeight: 500, }}>@HaruHana</span>
                        </Typography>
                        <Stack spacing={2}>
                            <AuthTextField
                                fullWidth
                                type="password"
                                autoComplete='new-password'
                                placeholder={t('signup.passwordLabel')}
                                {...getFieldProps('password')}
                                error={Boolean(touched.password && errors.password)}
                                helperText={touched.password && errors.password}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" style={{ padding: 4, }}>
                                            <PasswordIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <AuthTextField
                                fullWidth
                                type="password"
                                placeholder={t('signup.confirmPasswordLabel')}
                                {...getFieldProps('passwordConfirmation')}
                                error={Boolean(touched.passwordConfirmation && errors.passwordConfirmation)}
                                helperText={touched.passwordConfirmation && errors.passwordConfirmation}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" style={{ padding: 4, }}>
                                            <PasswordIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Stack>
                    </Box>
                    <ButtonBoxStyle>
                        <WrapperButtonStyle>
                            <LoadingButton
                                tabIndex={3}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                loading={isSubmitting}
                                style={{ padding: "16px 0", fontSize: "18px", fontWeight: 700, borderRadius: 18, fontFamily: 'Montserrat', }}
                            >
                                {t('resetPassword.changePasswordLabel')}
                            </LoadingButton>
                        </WrapperButtonStyle>
                    </ButtonBoxStyle>
                </FormRootStyle>
            </FormStyle>
        </FormikProvider>
    );
}
