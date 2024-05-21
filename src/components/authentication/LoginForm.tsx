import React, { useState } from 'react';
import { useGoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import { useFacebook, useLogin } from 'react-facebook';
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
import config from 'config';
import { OAuthType } from 'core/domain/authorize/oauthType';
import * as authorizeActions from 'redux/actions/authorizeActions';
import CloseIcon from '@mui/icons-material/CloseRounded';
import useAuth from 'hooks/useAuth';
import useIsMountedRef from 'hooks/useIsMountedRef';
import { useSnackbar } from 'notistack';
import useLocales from 'hooks/useLocales';
import { useDispatch } from 'redux/store';
import { PATH_AUTH } from 'routes/paths';
import { Box, InputAdornment, Typography } from '@mui/material';
import Logo from '../../assets/images/logo.png';
import UserIcon from 'components/icons/UserIcon';
import LockIcon from 'components/icons/LockIcon';
import VisibleIcon from 'components/icons/VisibleIcon';
import InVisibleIcon from 'components/icons/InVisibleIcon';

// ----------------------------------------------------------------------

const OAuthRootStyle = styled('div')(() => ({
    padding: '10px 0',
    justifyContent: 'space-around',
    display: 'flex',
    maxWidth: 120,
    margin: 'auto',
}));

const FormStyle = styled(Form)(() => ({
    textAlign: 'center',
    display: 'block',
    margin: 'auto',
}));

const FormRootStyle = styled('div')(({ theme }) => ({
    [theme.breakpoints.down('xs')]: {
        padding: '0px 40px 36px',
    },
}));

const ButtonBoxStyle = styled('div')(() => ({
    margin: 0,
    border: 0,
    display: 'inline-flex',
    padding: 0,
    position: 'relative',
    width: "100%",
    flexDirection: 'column',
    marginBottom: 25,
}));

const WrapperButtonStyle = styled('div')(() => ({
    position: 'relative',
    width: '100%',
}));

const BottomPaperStyle = styled('span')(() => ({
    display: 'inherit',
    fontSize: 'small',
    marginTop: 15,
}));

const SignupLinkStyle = styled(NavLink)(({ theme }) => ({
    color: theme.palette.primary.main,
    display: 'inline-block',
    fontWeight: 600,
}));

const ForgotLinkStyle = styled(NavLink)(() => ({
    padding: '14px 0',
    marginBottom: 10,
    fontSize: 14,
    fontWeight: 300,
    color: '#26282C',
}));

const OAuthIconStyle = styled('div')(() => ({
    fontSize: 20,
}));

const LoginTextField = styled(TextField)(() => ({
    '& input': {
        "&:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 100px #F5FAFC inset !important",
            WebkitTextFillColor: "default",
        },
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: 12,
        padding: "4px 12px",
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

// ----------------------------------------------------------------------

export default function LoginForm() {
    const { login, googleLogin } = useAuth();
    const { t } = useLocales();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);

    // const loginWithOAuth = (type: OAuthType) => dispatch<any>(authorizeActions.dbLoginWithOAuth(type));

    const LoginSchema = Yup.object().shape({
        email: Yup.string().email(t('login.emailNotVelid')).required(t('login.emailRequiredError')),
        password: Yup.string().required(t('login.passwordRequiredError')),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            remember: true,
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
            try {
                await login(values.email, values.password);
                enqueueSnackbar('Login success', {
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

    const google_login = useGoogleLogin({
        onSuccess: tokenResponse => {
            googleLogin(tokenResponse.code);
        },
        flow: 'auth-code',
    });

    // useGoogleOneTapLogin({
    //     onSuccess: tokenResponse => {
    //         googleLogin(tokenResponse.credential!);
    //     },
    // });

    const facebookLogin = useFacebook();

    const handleFacebookLogin = async () => {
        try {
            const api = await facebookLogin.init();
            const response = await api?.login({
                scope: "email",
            });
            console.log(response?.status);
        } catch (error: any) {
            console.log(error.message);
        }
    }

    const OAuthLogin = (
        <>
            <Typography fontSize="14px" fontWeight="300">or continue with</Typography>
            <OAuthRootStyle>
                {/* <IconButton onClick={() => loginWithOAuth(OAuthType.GITHUB)}>
                {' '}
                <OAuthIconStyle className="icon-github icon" />{' '}
            </IconButton> */}
                <IconButton onClick={() => handleFacebookLogin()} disabled={facebookLogin.isLoading}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.3832 16.7824H12.9871V27.6129C12.9871 27.8267 13.1586 28 13.3703 28H17.7855C17.9971 28 18.1686 27.8267 18.1686 27.6129V16.8334H21.1621C21.3568 16.8334 21.5205 16.6859 21.5427 16.4905L21.9974 12.5033C22.0099 12.3936 21.9755 12.2837 21.9028 12.2014C21.8301 12.119 21.726 12.0719 21.6168 12.0719H18.1688V9.57249C18.1688 8.81905 18.5703 8.43698 19.3624 8.43698C19.4752 8.43698 21.6168 8.43698 21.6168 8.43698C21.8285 8.43698 22 8.26364 22 8.04988V4.38996C22 4.17613 21.8285 4.00286 21.6168 4.00286H18.5099C18.4879 4.00178 18.4393 4 18.3675 4C17.8284 4 15.9546 4.10692 14.4744 5.48266C12.8343 7.0072 13.0623 8.83259 13.1168 9.14908V12.0718H10.3832C10.1715 12.0718 10 12.2451 10 12.4589V16.3952C10 16.6091 10.1715 16.7824 10.3832 16.7824Z" fill="#4A67AD" />
                    </svg>
                </IconButton>

                <IconButton onClick={() => google_login()}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_21_46)">
                            <path d="M23.5234 15.5C23.5245 17.1528 22.9423 18.753 21.8793 20.0186C20.8163 21.2842 19.3408 22.1341 17.7126 22.4185C16.0845 22.7029 14.4082 22.4036 12.9791 21.5733C11.5499 20.743 10.4597 19.435 9.9004 17.8797L5.88318 21.0935C7.13231 23.468 9.14103 25.3555 11.5886 26.4546C14.0362 27.5537 16.7814 27.8011 19.386 27.1571C21.9906 26.5132 24.3044 25.0151 25.9578 22.9021C27.6113 20.7891 28.509 18.183 28.5078 15.5" fill="#00AC47" />
                            <path d="M23.5234 15.5C23.5225 16.6174 23.2546 17.7184 22.742 18.7113C22.2295 19.7042 21.4871 20.5603 20.5767 21.2082L24.5482 24.3854C25.7936 23.2642 26.7895 21.8939 27.4716 20.3632C28.1537 18.8326 28.5067 17.1757 28.5078 15.5" fill="#4285F4" />
                            <path d="M9.47656 15.5C9.4783 14.6881 9.62174 13.8828 9.90041 13.1203L5.88319 9.90652C4.96977 11.6295 4.49219 13.5499 4.49219 15.5C4.49219 17.4501 4.96977 19.3705 5.88319 21.0935L9.90041 17.8797C9.62174 17.1172 9.4783 16.3119 9.47656 15.5Z" fill="#FFBA00" />
                            <path d="M16.5 8.47657C17.9861 8.47698 19.4333 8.9519 20.6307 9.83214L24.3101 6.39809C22.9442 5.22047 21.3301 4.36651 19.5881 3.89994C17.846 3.43337 16.0212 3.36623 14.2496 3.70354C12.478 4.04085 10.8055 4.77389 9.35678 5.84796C7.90811 6.92204 6.7207 8.30941 5.88318 9.90654L9.9004 13.1203C10.3903 11.7622 11.2866 10.5878 12.4674 9.757C13.6482 8.92615 15.0562 8.47908 16.5 8.47657Z" fill="#EA4435" />
                            <path d="M28.5078 14.5938V15.5L26.4688 18.6719H16.9531V13.6875H27.6016C27.8419 13.6875 28.0724 13.783 28.2424 13.9529C28.4123 14.1229 28.5078 14.3534 28.5078 14.5938Z" fill="#4285F4" />
                        </g>
                        <defs>
                            <clipPath id="clip0_21_46">
                                <rect width="29" height="29" fill="white" transform="translate(2 1)" />
                            </clipPath>
                        </defs>
                    </svg>

                </IconButton>
            </OAuthRootStyle>
        </>
    );

    const changePasswordVisible = () => {
        setShowPassword(!showPassword);
    }

    return (
        <FormikProvider value={formik}>
            <FormStyle autoComplete="off" noValidate onSubmit={handleSubmit}>
                <FormRootStyle>
                    <Box display="flex" alignItems="center" flexDirection="column">
                        <img src={Logo} alt="logo" height="112px" width="auto" />
                        <Typography fontSize="14px" fontWeight="300" fontFamily="Montserrat" maxWidth="200px" color="#0F344A" style={{ opacity: 0.6, }} margin="16px" >
                            Me & My Family Sharing Moments Forever.
                        </Typography>
                    </Box>
                    <LoginTextField
                        color="primary"
                        sx={{ minWidth: 220, width: "100%", marginTop: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" style={{ padding: 4, }}>
                                    <UserIcon />
                                </InputAdornment>
                            ),
                        }}
                        autoComplete="username"
                        placeholder='Email'
                        type="email"
                        {...getFieldProps('email')}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                        tabIndex={1}
                    />
                    <LoginTextField
                        color="primary"
                        sx={{ minWidth: 220, width: "100%", marginTop: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" style={{ padding: 4, }}>
                                    <LockIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end" style={{ opacity: 0.5, }}>
                                    {showPassword ? <InVisibleIcon onClick={changePasswordVisible} style={{ cursor: "pointer" }} /> : <VisibleIcon onClick={changePasswordVisible} style={{ cursor: "pointer" }} />}
                                </InputAdornment>
                            ),
                        }}
                        autoComplete="current-password"
                        placeholder='Password'
                        type={showPassword ? 'text' : 'password'}
                        {...getFieldProps('password')}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password}
                        tabIndex={2}
                    />
                    <br />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: "100%" }}>
                        <ForgotLinkStyle to={PATH_AUTH.resetPassword}>{t('login.forgetPasswordMessage')}</ForgotLinkStyle>
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
                                style={{
                                    marginTop: "10px",
                                    borderRadius: "16px",
                                    padding: "15px",
                                    fontSize: "16px",
                                }}
                            >
                                {t('login.loginButton')}
                            </LoadingButton>
                        </WrapperButtonStyle>
                    </ButtonBoxStyle>
                    {config.settings.enabledOAuthLogin ? OAuthLogin : ''}
                    <BottomPaperStyle>
                        {t('login.createAccountText')}{' '}
                        <SignupLinkStyle to={PATH_AUTH.register}>{t('login.createAccountButton')}</SignupLinkStyle>
                    </BottomPaperStyle>
                </FormRootStyle>
            </FormStyle>
        </FormikProvider>
    );
}
