import { CloseRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button, IconButton, InputAdornment, MenuItem, Select, Switch, SwitchProps, TextField, Theme } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/styles';
import AvatarCheckIcon from 'components/icons/AvatarCheckIcon';
import CalendarIcon from 'components/icons/CalendarIcon';
import ChevronDownIcon from 'components/icons/ChevronDownIcon';
import EmailIcon from 'components/icons/EmailIcon';
import PasswordIcon from 'components/icons/PasswordIcon';
import UserIcon from 'components/icons/UserIcon';
import { Form, FormikProvider, useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import useIsMountedRef from 'hooks/useIsMountedRef';
import useLocales from 'hooks/useLocales';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import { useRef } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';

const RootStyle = styled(Box)(() => ({
    padding: "0 20px",
}));

const TitleStyle = styled('p')(() => ({
    fontSize: 16,
    fontWeight: 600,
    marginTop: 15,
}));

const FormStyle = styled(Box)(() => ({
    marginTop: 15,
}));

const HRStyle = styled('hr')(() => ({
    borderColor: "#E4E4E4",
    borderWidth: 1.5,
    opacity: 0.1,
}));

const AuthTextField = styled(TextField)(() => ({
    margin: "12px 0",
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

const SelectBox = styled(Select)(() => ({
    width: "100%",
    margin: "12px 0",
    backgroundColor: '#F5FAFC !important',
    '& .MuiSelect-select': {
        padding: "16.5px 20px",
    },
    '& fieldset': {
        border: 'none',
    },
}));

const WrapperButtonStyle = styled('div')(({ theme }: { theme: Theme }) => ({
    position: 'relative',
    width: '100%',
    margin: "10px auto",
    [theme.breakpoints.up('sm')]: {
        maxWidth: 400,
        minWidth: 320,
    },
}));

export function AccountSettingComponent() {
    const { t } = useLocales();
    const isMountedRef = useIsMountedRef();
    const { user, logout, updatePassword } = useAuth();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const Step1Schema = Yup.object().shape({
        // fullName: Yup.string()
        //     .min(2, t('signup.inputTooShort'))
        //     .max(50, t('signup.inputTooLong'))
        //     .required(t('signup.fullNameRequired')),
        // email: Yup.string()
        //     .email(t('signup.emailNotValid'))
        //     .required(t('signup.emailRequired')),
        currentPassword: Yup.string()
            .required(t('signup.passwordRequired')),
        password: Yup.string()
            .min(8, t('signup.inputTooShort'))
            .required(t('signup.passwordRequired')),
        passwordConfirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], t('signup.confirmEqualPasswordError')),
    });

    const formik = useFormik({
        initialValues: {
            // fullName: user?.fullName,
            // email: user?.email,
            currentPassword: '',
            password: '',
            passwordConfirmation: '',
        },
        validationSchema: Step1Schema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            try {
                const res = await updatePassword(values.currentPassword, values.password);
                if (res.success) {
                    resetForm();
                    enqueueSnackbar('Password was updated correctly.', {
                        variant: 'success',
                        action: (key) => (
                            <IconButton size="small" onClick={() => closeSnackbar(key)}>
                                <CloseRounded />
                            </IconButton>
                        ),
                    });
                }
                else {
                    enqueueSnackbar(res.error, {
                        variant: 'error',
                        action: (key) => (
                            <IconButton size="small" onClick={() => closeSnackbar(key)}>
                                <CloseRounded />
                            </IconButton>
                        ),
                    });
                }
                if (isMountedRef.current) {
                    setSubmitting(false);
                }

            } catch (error: any) {
                // eslint-disable-next-line no-console
                if (isMountedRef.current) {
                    const errors = { afterSubmit: error.message };
                    setStatus(errors);
                    setSubmitting(false);
                }
            }
        },
    });

    const { touched, handleSubmit, isSubmitting, getFieldProps, values, resetForm } = formik;
    const errors = formik.errors as any;

    console.log(user);

    return (
        <RootStyle>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit} style={{ height: "100%", }}>
                    <TitleStyle>
                        Account Information
                    </TitleStyle>
                    <FormStyle>
                        <AuthTextField
                            fullWidth
                            placeholder={t('signup.fullName')}
                            value={user?.fullName}
                            disabled
                            // {...getFieldProps('fullName')}
                            // error={Boolean(touched.fullName && errors.fullName)}
                            // helperText={touched.fullName && errors.fullName}
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
                            type="text"
                            placeholder={t('signup.birthdate')}
                            value={moment(user?.birthdate).format('DD/MM/YYYY')}
                            disabled
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" style={{ padding: 4, }}>
                                        <CalendarIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <AuthTextField
                            fullWidth
                            type="email"
                            value={user?.email}
                            disabled
                            // placeholder={t('signup.emailLabel')}
                            // {...getFieldProps('email')}
                            // error={Boolean(touched.email && errors.email)}
                            // helperText={touched.email && errors.email}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" style={{ padding: 4, }}>
                                        <EmailIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormStyle>
                    <HRStyle style={{ margin: "20px 0" }} />
                    <TitleStyle>
                        Account Type
                    </TitleStyle>
                    <FormStyle>
                        <SelectBox
                            value={user?.role}
                            IconComponent={(props) => {
                                return (
                                    <ChevronDownIcon {...props} style={{ right: 16, top: "calc(50% - 8px)" }} />
                                );
                            }}
                            renderValue={(value: any) => {
                                return (
                                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", fontSize: "18px", fontWeight: 400 }}>
                                        <AvatarCheckIcon color="#637381" />
                                        {value}
                                    </Box>
                                );
                            }}
                            disabled
                        >
                            <MenuItem value="Parent">Parent</MenuItem>
                            <MenuItem value="Child">Child</MenuItem>
                            <MenuItem value="Admin">Admin</MenuItem>
                        </SelectBox>
                    </FormStyle>
                    <HRStyle style={{ margin: "20px 0" }} />
                    <TitleStyle>
                        Account Password
                    </TitleStyle>
                    <FormStyle>
                        <AuthTextField
                            fullWidth
                            type="password"
                            autoComplete='new-password'
                            placeholder={t('signup.passwordLabel')}
                            {...getFieldProps('currentPassword')}
                            error={Boolean(touched.currentPassword && errors.currentPassword)}
                            helperText={touched.currentPassword && errors.currentPassword}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" style={{ padding: 4, }}>
                                        <PasswordIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormStyle>
                    <TitleStyle>
                        New Password
                    </TitleStyle>
                    <FormStyle>
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
                                {t('config.changePasswordLabel')}
                            </LoadingButton>
                        </WrapperButtonStyle>
                    </FormStyle>
                </Form>
            </FormikProvider>
            <Box display="flex" justifyContent="right">
                <Button color="error" onClick={logout} style={{ margin: "8px" }}>
                    LOGOUT ACCOUNT
                </Button>
            </Box>
        </RootStyle>
    );
}

const translateWrapper = withTranslation('translations')(AccountSettingComponent);
export default translateWrapper;
