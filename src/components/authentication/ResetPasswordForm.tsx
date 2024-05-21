import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';

//
import { NavLink } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/CloseRounded';
import useAuth from 'hooks/useAuth';
import useIsMountedRef from 'hooks/useIsMountedRef';
import { useSnackbar } from 'notistack';
import useLocales from 'hooks/useLocales';
import { PATH_AUTH } from 'routes/paths';
import { Box, InputAdornment, Typography } from '@mui/material';
import EmailIcon from 'components/icons/EmailIcon';

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

export default function ResetPasswordForm() {
    const { resetPassword } = useAuth();
    const { t } = useLocales();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [sentCode, setSentCode] = useState(false);

    const ResetPasswordSchema = Yup.object().shape({
        email: Yup.string().email(t('login.emailNotVelid')).required(t('login.emailRequiredError')),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: ResetPasswordSchema,
        onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
            try {
                const res = await resetPassword(values.email);
                if (res.success) {
                    setSentCode(true);
                    enqueueSnackbar('Verification email sent! Please check your email.', {
                        variant: 'success',
                        action: (key) => (
                            <IconButton size="small" onClick={() => closeSnackbar(key)}>
                                <CloseIcon />
                            </IconButton>
                        ),
                    });
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

    const sendVerifiacationEmail = () => {
        handleSubmit();
    }

    const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

    return (
        <FormikProvider value={formik}>
            <FormStyle autoComplete="off" noValidate onSubmit={handleSubmit}>
                <FormRootStyle>
                    <Box>
                        <Typography fontWeight="400" fontSize="26px" textAlign="left">
                            Forget <span style={{ color: '#469AD0', fontWeight: 600, }} >Password</span><span style={{ fontWeight: 600, }}>!</span>
                        </Typography>
                        <Typography color="#6F8592" fontWeight="300" fontSize="400" textAlign="left" paddingY="8px">
                            Recover your account using your register email address <span style={{ color: "#469AD0", fontWeight: 500, }}>@HaruHana</span>
                        </Typography>
                        <AuthTextField
                            color="secondary"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" style={{ padding: 4, }}>
                                        <EmailIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ marginTop: 2 }}
                            fullWidth
                            autoComplete="username"
                            type="email"
                            {...getFieldProps('email')}
                            error={Boolean(touched.email && errors.email)}
                            helperText={touched.email && errors.email}
                            tabIndex={1}
                            placeholder='Email Address'
                            disabled={isSubmitting || sentCode}
                        />
                    </Box>
                    <ButtonBoxStyle>
                        {sentCode && <Typography fontWeight="300" fontSize="14px" marginBottom="20px">
                            Didn’t received verification email <span style={{ color: "#469AD0", fontWeight: 600, cursor: "pointer" }} onClick={sendVerifiacationEmail}>Resend</span>
                        </Typography>}
                        <WrapperButtonStyle>
                            <LoadingButton
                                tabIndex={3}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                loading={isSubmitting}
                                disabled={sentCode}
                                style={{ padding: "16px 0", fontSize: "18px", fontWeight: 700, borderRadius: 18, fontFamily: 'Montserrat', }}
                            >
                                {t('resetPassword.verifyButton')}
                            </LoadingButton>
                        </WrapperButtonStyle>
                    </ButtonBoxStyle>
                </FormRootStyle>
            </FormStyle>
        </FormikProvider>
    );
}
