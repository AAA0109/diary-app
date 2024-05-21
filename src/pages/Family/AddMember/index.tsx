import { useTranslation } from 'react-i18next';

import { Box, Button, CircularProgress, FormControl, IconButton, InputAdornment, TextField, Tooltip, Typography, styled } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import Header from 'components/header/Header';
import { useDispatch } from 'react-redux';
import { setHeaderTitle, setNavigationStep } from 'redux/actions/globalActions';
import useAuth from 'hooks/useAuth';
import QRCode from "react-qr-code";
import CopyIcon from 'components/icons/CopyIcon';
import { CloseOutlined } from '@mui/icons-material';
import CheckIcon from 'components/icons/CheckIcon';
import useIsMountedRef from 'hooks/useIsMountedRef';
import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';
import EmailIcon from 'components/icons/EmailIcon';
import { PATH_MAIN } from 'routes/paths';

export default function AddMember() {
    const { t } = useTranslation();
    const { user, sendInvitation } = useAuth();
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [inviteMethod, setInviteMethod] = useState<string>('email');

    useEffect(() => {
        dispatch<any>(setNavigationStep(1));
    }, []);

    const inviteLink = `${window.location.origin}${PATH_MAIN.user.acceptInvitation(btoa(JSON.stringify({
        familyId: user?.family?.id,
        guardianId: user?.id,
    })))}`;

    const handleCopyInviteLinkToClipboard = () => {
        navigator.clipboard.writeText(inviteLink);
        enqueueSnackbar('Copied to clipboard', {
            variant: 'success',
            action: (key) => (
                <IconButton size="small" onClick={() => closeSnackbar(key)}>
                    <CloseOutlined />
                </IconButton>
            ),
        });
    }

    const isMountedRef = useIsMountedRef();

    const MemberEmailSchema = Yup.object().shape({
        memberEmail: Yup.string().email('Invalid Email').required('Email address is required'),
    });

    const formik = useFormik({
        initialValues: {
            memberEmail: '',
        },
        validationSchema: MemberEmailSchema,
        onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
            try {
                const res = await sendInvitation(values.memberEmail, inviteLink);
                enqueueSnackbar('Invitation is sent successfully', {
                    variant: 'success',
                    action: (key) => (
                        <IconButton size="small" onClick={() => closeSnackbar(key)}>
                            <CloseOutlined />
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

    return (
        <RootStyle>
            <Header child={
                <Box marginLeft={1}>
                    <PageTitle>
                        Invite Member
                    </PageTitle>
                    <PageDescription>
                        Invites your love one’s to haru hana
                    </PageDescription>
                </Box>
            } />
            <QRCodePane>
                <QRCode value={inviteLink} width={180} />
                <Typography fontSize={12} fontWeight={400} color='#26282C' my={3}>
                    Family QR Scan
                </Typography>
            </QRCodePane>
            <CopyLinkPane>
                <Typography fontWeight={700}>Copy Invite Link</Typography>
                <CopyIcon style={{ cursor: 'pointer' }} onClick={handleCopyInviteLinkToClipboard} />
            </CopyLinkPane>
            <Typography fontSize={12} fontWeight={400} color='#26282C' my={3}>
                Invite using different methods
            </Typography>
            <GroupSelectPane>
                <InviteMethodButton>
                    Email
                    <IconPane>
                        <CheckIcon width={16} height={16} color="white" />
                    </IconPane>
                </InviteMethodButton>
                <Tooltip title="Cooming soon">
                    <InviteMethodButton disabled>
                        Phone
                    </InviteMethodButton>
                </Tooltip>
            </GroupSelectPane>
            <FormikProvider value={formik}>
                <FormBody autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <FormControl component="div" required style={{ width: '100% ' }}>
                        <AuthTextField
                            fullWidth
                            type="email"
                            placeholder="Email Address"
                            {...getFieldProps('memberEmail')}
                            error={Boolean(touched.memberEmail && errors.memberEmail)}
                            helperText={touched.memberEmail && errors.memberEmail}
                            tabIndex={1}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" style={{ padding: 4, }}>
                                        <EmailIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormControl>
                    <ActionGroup>
                        <BootstrapButton type='submit' variant='contained' disabled={isSubmitting}>
                            Send Invite
                        </BootstrapButton>
                    </ActionGroup>
                </FormBody>
            </FormikProvider>
        </RootStyle>
    );
}

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
    padding: "24px 12px",
    margin: "0 auto",
    position: 'relative',
}));

const PageTitle = styled(Typography)(() => ({
    fontSize: 18,
    fontWeight: 600,
    color: "#000",
}))

const PageDescription = styled(Typography)(() => ({
    fontSize: 12,
    fontWeight: 400,
    color: "#26282C90",
}))

const QRCodePane = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
}))

const CopyLinkPane = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '12px 0',
    padding: '20px 28px',
    borderRadius: 12,
    backgroundColor: '#469AD00D',
}))

const GroupSelectPane = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: 18,
}))

const InviteMethodButton = styled(Button)(() => ({
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    border: '1px solid #469AD0',
    borderRadius: 12,
    backgroundColor: '#469AD00D',
    '&:disabled': {
        border: 'none',
        pointerEvents: 'all',
        cursor: 'not-allowed',
        '&:hover': {
            backgroundColor: '#469AD00D',
        }
    }
}))

const IconPane = styled('div')(() => ({
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: '#469AD0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}))

const FormStyle = styled(Form)(() => ({
    textAlign: 'center',
    display: 'block',
    margin: 'auto',
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

const ActionGroup = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    justifyContent: 'end',
    marginTop: 12,
}))

const BootstrapButton = styled(Button)(({ theme }) => ({
    width: '100%',
    margin: '8px 0',
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: 700,
    borderRadius: 18,
    fontFamily: 'Montserrat',
}));

const FormBody = styled(FormStyle)(() => ({
    width: '100%',
    margin: '36px 0',
}))