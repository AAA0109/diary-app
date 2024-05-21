import * as Yup from 'yup';
import TextField from '@mui/material/TextField';
import useIsMountedRef from 'hooks/useIsMountedRef';
import { useSnackbar } from 'notistack';
import useLocales from 'hooks/useLocales';
import { Form, FormikProvider, useFormik } from 'formik';
import { Alert, Box, InputAdornment, Stack, Typography, styled } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { PATH_AUTH } from 'routes/paths';
import useAuth from 'hooks/useAuth';
import { RegisterStepEnum } from 'models/authorize/signupStepEnum';
import moment from 'moment';
import UserIcon from 'components/icons/UserIcon';
import CalendarIcon from 'components/icons/CalendarIcon';

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

type SignupStep1Props = {
    handleProgress: (progress: number) => void;
    handleNext: (step: number) => void;
}

// ----------------------------------------------------------------------

export default function SignupStep1({ handleProgress, handleNext }: SignupStep1Props) {
    const { savePrimaryInformation } = useAuth();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { t } = useLocales();

    const Step1Schema = Yup.object().shape({
        firstName: Yup.string()
            .min(2, t('signup.inputTooShort'))
            .max(50, t('signup.inputTooLong'))
            .required(t('signup.fullNameRequired')),
        lastName: Yup.string()
            .min(2, t('signup.inputTooShort'))
            .max(50, t('signup.inputTooLong'))
            .required(t('signup.fullNameRequired')),
        birthdate: Yup.date()
            .max(new Date(Date.now() - 94608000000), "You are too young.")
            .required(t('signup.birthdateRequired')),
    });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            birthdate: '',
        },
        validationSchema: Step1Schema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            try {
                await savePrimaryInformation(
                    values.firstName,
                    values.lastName,
                    values.birthdate,
                    RegisterStepEnum.GuardianInformation,
                );
                if (isMountedRef.current) {
                    setSubmitting(false);
                    handleNext(RegisterStepEnum.GuardianInformation);
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

    const { touched, handleSubmit, isSubmitting, getFieldProps, values } = formik;
    const errors = formik.errors as any;

    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        handleProgress((((!values.firstName || errors.firstName) ? 0 : 100) + ((!values.lastName || errors.lastName) ? 0 : 100) + ((!values.birthdate || errors.birthdate) ? 0 : 100)) / 3);
    }, [values, errors])

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit} style={{ height: "100%", }}>
                <RootStyle>
                    <Stack spacing={3}>
                        {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

                        <AuthTextField
                            fullWidth
                            placeholder="First Name"
                            {...getFieldProps('firstName')}
                            error={Boolean(touched.firstName && errors.firstName)}
                            helperText={touched.firstName && errors.firstName}
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
                            placeholder="Last Name"
                            {...getFieldProps('lastName')}
                            error={Boolean(touched.lastName && errors.lastName)}
                            helperText={touched.lastName && errors.lastName}
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
                            inputRef={ref}
                            onFocus={() => { if (ref.current) ref.current.type = "date"; }}
                            placeholder={t('signup.birthdate')}
                            {...getFieldProps('birthdate')}
                            error={Boolean(touched.birthdate && errors.birthdate)}
                            helperText={touched.birthdate && errors.birthdate}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" style={{ padding: 4, }}>
                                        <CalendarIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Stack>
                    <Box>
                        <Typography fontWeight="300" fontSize="14px" marginBottom="20px">
                            Already have an account <NavLink style={{ color: "#469AD0", fontWeight: 600, }} to={PATH_AUTH.login} >Login!</NavLink>
                        </Typography>
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
                                {t('signup.continueButton')}
                            </LoadingButton>
                        </WrapperButtonStyle>
                    </Box>
                </RootStyle>
            </Form>
        </FormikProvider>
    );
}
