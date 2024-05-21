import * as Yup from 'yup';
import TextField from '@mui/material/TextField';
import useIsMountedRef from 'hooks/useIsMountedRef';
import { useSnackbar } from 'notistack';
import useLocales from 'hooks/useLocales';
import { Form, FormikProvider, useFormik } from 'formik';
import { Alert, Box, Checkbox, FormControlLabel, IconButton, InputAdornment, Stack, ToggleButton, ToggleButtonGroup, Typography, styled } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useEffect, useRef, useState } from 'react';
import useAuth from 'hooks/useAuth';
import { RegisterStepEnum } from 'models/authorize/signupStepEnum';
import UserIcon from 'components/icons/UserIcon';
import EmailIcon from 'components/icons/EmailIcon';
import CloseIcon from '@mui/icons-material/CloseRounded';
import moment from 'moment';
import { GroupAdd, PeopleOutline } from '@mui/icons-material';

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

type SignupStep2Props = {
    handleProgress: (progress: number) => void;
    handleNext: (step: number) => void;
}

// ----------------------------------------------------------------------

export default function SignupStep2({ handleProgress, handleNext }: SignupStep2Props) {
    const { saveGuardianInformation } = useAuth();
    const isMountedRef = useIsMountedRef();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { t } = useLocales();

    const { birthdate, lastName } = JSON.parse(localStorage.getItem('register') ?? '{}');
    const isGuardian = moment.utc().diff(moment.utc(birthdate), 'years') >= 17;

    const [isCreateFamily, setIsCreateFamily] = useState<boolean>(isGuardian);
    const [familyName, setFamilyName] = useState<string>("");

    useEffect(() => {
        if (lastName) {
            setFamilyName(lastName + "'s Family")
        }
    }, [lastName])

    const Step2Schema = Yup.object().shape({
        guardianFirstName: Yup.string()
            .min(2, t('signup.inputTooShort'))
            .max(50, t('signup.inputTooLong'))
            .required(t('signup.guardianNameRequired')),
        guardianLastName: Yup.string()
            .min(2, t('signup.inputTooShort'))
            .max(50, t('signup.inputTooLong'))
            .required(t('signup.guardianNameRequired')),
        guardianEmail: Yup.string()
            .email(t('signup.emailNotValid'))
            .required(t('signup.guardianEmailRequired')),
    });

    const formik = useFormik({
        initialValues: {
            guardianFirstName: '',
            guardianLastName: '',
            guardianEmail: '',
            allowParental: true,
        },
        validationSchema: Step2Schema,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            try {
                const res = await saveGuardianInformation(
                    values.guardianFirstName,
                    values.guardianLastName,
                    values.guardianEmail,
                    values.allowParental
                );
                if (res && res.error) {
                    enqueueSnackbar(res.error, {
                        variant: 'error',
                        action: (key) => (
                            <IconButton size="small" onClick={() => closeSnackbar(key)}>
                                <CloseIcon />
                            </IconButton>
                        ),
                    });
                    return;
                }
                if (isMountedRef.current) {
                    setSubmitting(false);
                    handleNext(RegisterStepEnum.AccountInformation);
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
        handleProgress((((!values.guardianFirstName || errors.guardianFirstName) ? 0 : 100) + ((!values.guardianLastName || errors.guardianLastName) ? 0 : 100) + ((!values.guardianEmail || errors.guardianEmail) ? 0 : 100)) / 3);
    }, [values, errors])

    const handleCreateFamily = async () => {
        localStorage.setItem('register', JSON.stringify({ ...JSON.parse(localStorage.getItem('register')!), familyName, }));
        handleNext(RegisterStepEnum.AccountInformation);
    }

    return (
        <Box>
            {isGuardian && <ToggleButtonGroup
                color="primary"
                value={isCreateFamily ? 'create' : 'enter'}
                exclusive
                onChange={(e: any) => {
                    setIsCreateFamily(e.target.value === 'create');
                }}
                aria-label="Platform"
                style={{ marginBottom: 16, }}
            >
                <ToggleSwitchButton value="create">Create your family</ToggleSwitchButton>
                <ToggleSwitchButton value="enter">Find your family</ToggleSwitchButton>
            </ToggleButtonGroup>}
            <Box style={{ display: isCreateFamily ? 'none' : 'block' }}>
                <FormikProvider value={formik}>
                    <Form autoComplete="off" noValidate onSubmit={handleSubmit} style={{ height: "100%", }}>
                        <RootStyle>
                            <Stack spacing={3}>
                                {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>}

                                <AuthTextField
                                    fullWidth
                                    placeholder="Gurdian First Name"
                                    {...getFieldProps('guardianFirstName')}
                                    error={Boolean(touched.guardianFirstName && errors.guardianFirstName)}
                                    helperText={touched.guardianFirstName && errors.guardianFirstName}
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
                                    placeholder="Gurdian Last Name"
                                    {...getFieldProps('guardianLastName')}
                                    error={Boolean(touched.guardianLastName && errors.guardianLastName)}
                                    helperText={touched.guardianLastName && errors.guardianLastName}
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
                                    inputRef={ref}
                                    placeholder={t('signup.guardianEmail')}
                                    {...getFieldProps('guardianEmail')}
                                    error={Boolean(touched.guardianEmail && errors.guardianEmail)}
                                    helperText={touched.guardianEmail && errors.guardianEmail}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start" style={{ padding: 4, }}>
                                                <EmailIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <FormControlLabel control={<Checkbox defaultChecked color='info' {...getFieldProps('allowParental')} />} label="Allow Parental Control Settings" />
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
                                        {t('signup.continueButton')}
                                    </LoadingButton>
                                </WrapperButtonStyle>
                            </Box>
                        </RootStyle>
                    </Form>
                </FormikProvider>
            </Box>
            <Box style={{ display: !isCreateFamily ? 'none' : 'block', padding: "25px 0" }}>
                <AuthTextField
                    fullWidth
                    placeholder="Enter your family name"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start" style={{ padding: 4, }}>
                                <PeopleOutline />
                            </InputAdornment>
                        ),
                    }}
                />
                <Box marginTop="120px">
                    <WrapperButtonStyle>
                        <LoadingButton
                            tabIndex={3}
                            fullWidth
                            size="large"
                            onClick={handleCreateFamily}
                            variant="contained"
                            loading={isSubmitting}
                            style={{ padding: "16px 0", fontSize: "18px", fontWeight: 700, borderRadius: 18, fontFamily: 'Montserrat', }}
                        >
                            {t('signup.continueButton')}
                        </LoadingButton>
                    </WrapperButtonStyle>
                </Box>
            </Box>
        </Box>
    );

}

const ToggleSwitchButton = styled(ToggleButton)(({ theme }) => ({
    minWidth: '150px',
}))
