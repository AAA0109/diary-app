import * as Yup from 'yup';
import TextField from '@mui/material/TextField';
import useIsMountedRef from 'hooks/useIsMountedRef';
import { useSnackbar } from 'notistack';
import useLocales from 'hooks/useLocales';
import { Form, FormikProvider, useFormik } from 'formik';
import { Alert, Box, Checkbox, FormControlLabel, IconButton, InputAdornment, Stack, Typography, styled } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useEffect, useRef } from 'react';
import useAuth from 'hooks/useAuth';
import { RegisterStepEnum } from 'models/authorize/signupStepEnum';
import UserIcon from 'components/icons/UserIcon';
import EmailIcon from 'components/icons/EmailIcon';
import CloseIcon from '@mui/icons-material/CloseRounded';
import PasswordIcon from 'components/icons/PasswordIcon';
import { Link } from 'react-router-dom';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    padding: '0',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
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

const WrapperButtonStyle = styled('div')(({ theme }) => ({
    position: 'relative',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        minWidth: 320,
    },
}));

type SignupStep3Props = {
    handleProgress: (progress: number) => void;
    handleNext: (step: number) => void;
}

// ----------------------------------------------------------------------

export default function SignupStep3({ handleProgress, handleNext }: SignupStep3Props) {
    const { fetchRegisterToken, login } = useAuth();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { t } = useLocales();

    const Step3Schema = Yup.object().shape({
        username: Yup.string()
            .min(2, t('signup.inputTooShort'))
            .max(20, t('signup.inputTooLong'))
            .required(t('signup.usernameRequired')),
        email: Yup.string()
            .email(t('signup.emailNotValid'))
            .required(t('signup.emailRequired')),
        password: Yup.string()
            .min(8, t('signup.inputTooShort'))
            .required(t('signup.passwordRequired')),
        passwordConfirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], t('signup.confirmEqualPasswordError')),
        agreeTerms: Yup.boolean().oneOf([true]),
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            agreeTerms: false,
            afterSubmit: '',
        },
        validationSchema: Step3Schema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            try {
                const result = await fetchRegisterToken(
                    values.email,
                    values.password,
                    values.username
                );                
                if(result.error) {
                    setErrors(result.error);
                    setSubmitting(false);
                }
                else {
                    await login(values.email, values.password);
                }
            } catch (error: any) {
                // eslint-disable-next-line no-console
                if (isMountedRef.current) {
                    const errors = { afterSubmit: error.message };
                    setErrors(errors);
                    setSubmitting(false);
                }
            }
        },
    });

    const { touched, handleSubmit, isSubmitting, getFieldProps, values, setErrors } = formik;
    const errors = formik.errors as any;

    useEffect(() => {
        handleProgress((((!values.username || errors.username) ? 0 : 100) + ((!values.email || errors.email) ? 0 : 100) + ((!values.password || errors.password) ? 0 : 100) + ((!values.passwordConfirmation || errors.passwordConfirmation) ? 0 : 100) + (!values.agreeTerms ? 0 : 100)) / 5);
    }, [values, errors])

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit} style={{ height: "100%", }}>
                <RootStyle>
                    <Stack spacing={2}>
                        {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

                        <AuthTextField
                            fullWidth
                            autoComplete='off'
                            placeholder={t('signup.username')}
                            {...getFieldProps('username')}
                            error={Boolean(touched.username && errors.username)}
                            helperText={touched.username && errors.username}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" style={{ padding: 4, }}>
                                        <UserIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <AuthTextField
                            fullWidth
                            type="email"
                            autoComplete='new-email'
                            placeholder={t('signup.emailLabel')}
                            {...getFieldProps('email')}
                            error={Boolean(touched.email && errors.email)}
                            helperText={touched.email && errors.email}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" style={{ padding: 4, }}>
                                        <EmailIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />

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
                        <FormControlLabel control={<Checkbox color='info' {...getFieldProps('agreeTerms')} />} label={
                            <Typography>
                                I agree with the <Link to={""} target='_blank'>Terms & Conditions</Link>
                            </Typography>
                        } />
                        {
                            touched.agreeTerms && errors.agreeTerms && (<Typography variant='caption' sx={{ color: 'red', marginTop: "0 !important", marginLeft: "12px !important", marginBottom: "16px !important", }} textAlign="left">
                                You should agree with the terms and conditions
                            </Typography>)
                        }
                    </Stack>
                    <Box>
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
                                {t('signup.createButton')}
                            </LoadingButton>
                        </WrapperButtonStyle>
                    </Box>
                </RootStyle>
            </Form>
        </FormikProvider>
    );
}
