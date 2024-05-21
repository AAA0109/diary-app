import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';

//
import { NavLink, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/CloseRounded';
import useAuth from 'hooks/useAuth';
import useIsMountedRef from 'hooks/useIsMountedRef';
import { useSnackbar } from 'notistack';
import useLocales from 'hooks/useLocales';
import { PATH_AUTH, PATH_MAIN } from 'routes/paths';
import { Avatar, Box, Checkbox, FormControlLabel, InputAdornment, Typography } from '@mui/material';
import AuthWrapper from 'containers/authWrapper';
import BackButton from 'components/backButton';
import ImageCardsIcon from 'components/icons/ImageCardsIcon';
import { ArrowForwardIos } from '@mui/icons-material';
import { ICommonService } from 'core/services/common/ICommonService';
import { provider } from 'socialEngine';
import { SocialProviderTypes } from 'core/socialProviderTypes';
// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    display: 'block',
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
        height: 'calc(100% - 100px)',
    },
}));

const UploadPanel = styled(Box)(({ theme }) => ({
    backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='11' ry='11' stroke='%23469AD0FF' stroke-width='2' stroke-dasharray='6%2c 14' stroke-dashoffset='22' stroke-linecap='square'/%3e%3c/svg%3e")`,
    borderRadius: "12px",
    padding: "16px",
    backgroundColor: "#F5FAFC",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
}));

const PrivacyPanel = styled(Box)(({ theme }) => ({
    backgroundColor: "#F5FAFC",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
}));

const WrapperButtonStyle = styled('div')(({ theme }) => ({
    marginTop: '16px',
    position: 'relative',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        maxWidth: 400,
        minWidth: 320,
    },
}));

const commonService: ICommonService = provider.get<ICommonService>(SocialProviderTypes.CommonService);

export default function OnboardingPage() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { startSharing, updateProfile, user } = useAuth();
    const [imageUrl, setImageUrl] = useState("");
    const [updatingSettings, setUpdatingSettings] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { t } = useLocales();

    const handleFileUpload = (event: any) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImageUrl(reader.result?.toString()!);
        };

        reader.readAsDataURL(file);
    };

    const handleClickUploadPanel = () => {
        inputRef.current?.click();
    }

    const removeSelectedFile = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        if (inputRef.current?.value) {
            inputRef.current.value = "";
        }
        setImageUrl("");
    }

    const handleStartSharing = async () => {
        setUpdatingSettings(true);
        try {
            let uploadUrl = "";
            if (inputRef.current?.files![0]) {
                const res = await commonService.fileUpload(inputRef.current.files[0]);
                uploadUrl = res.url;
            }
            await updateProfile({
                avatar: uploadUrl,
            });
            await startSharing();
            enqueueSnackbar('Start sharing successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Something wrong, please try again', { variant: 'error' });
        }
        setUpdatingSettings(false);
    }

    useEffect(() => {
        if (user?.onboarding === false) {
            navigate(PATH_MAIN.root);
        }
    }, [user?.onboarding])

    return (
        <AuthWrapper>
            <BackButton ending={
                <Typography color="#469AD0" fontSize="14px" fontWeight="600" onClick={startSharing} marginLeft="auto" style={{ cursor: "pointer" }}>
                    Skip
                </Typography>
            } />
            <RootStyle>
                <Typography fontWeight="500" fontSize="26px" textAlign="left">
                    Congratulation!
                </Typography>
                <Typography color="#6F8592" fontWeight="300" textAlign="left" paddingY="8px" style={{ opacity: .6 }}>
                    Your account <span style={{ color: '#469AD0', fontWeight: 600, }}>@HaruHana</span> has been created and now you can start sharing your moments with your family.
                </Typography>
                <UploadPanel marginY="16px" marginBottom="30" onClick={handleClickUploadPanel} position="relative">
                    {imageUrl && <CloseIcon style={{ position: "absolute", top: 8, right: 8, cursor: "pointer", color: "gray", opacity: .6, }} onClick={removeSelectedFile} />}
                    {imageUrl ?
                        <Avatar
                            src={imageUrl}
                            alt="uploaded"
                            color='default'
                            style={{ width: 72, height: 72, marginBottom: "12px" }}
                        /> : <ImageCardsIcon fontSize="large" color="primary" />}
                    <Typography marginY="4px" marginTop="8px" fontSize="16px" fontWeight="400">
                        Upload Profile Picture
                    </Typography>
                    <Typography color="#B5B5B8" fontSize="14px" fontWeight="400">
                        JPEG or PNG, no larger than 10MB
                    </Typography>
                    <input
                        ref={inputRef}
                        id="upload-image"
                        hidden
                        accept=".jpg, .jpeg, .png"
                        type="file"
                        onChange={handleFileUpload}
                    />
                </UploadPanel>
                <PrivacyPanel marginY="18px" padding="16px 24px">
                    <Typography fontSize="14px" fontWeight="400">
                        Data Collection & Conset
                    </Typography>
                    <ArrowForwardIos color='primary' />
                </PrivacyPanel>
                <PrivacyPanel marginY="18px" padding="16px 24px">
                    <Typography fontSize="14px" fontWeight="400">
                        Account Deletion Info.
                    </Typography>
                    <ArrowForwardIos color='primary' />
                </PrivacyPanel>
                <FormControlLabel control={<Checkbox color='info' defaultChecked />} label="Receive marketing or notifications?" />
                <WrapperButtonStyle>
                    <LoadingButton
                        tabIndex={3}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        onClick={handleStartSharing}
                        loading={updatingSettings}
                        style={{ padding: "16px 0", fontSize: "18px", fontWeight: 700, borderRadius: 18, fontFamily: 'Montserrat', }}
                    >
                        Start Sharing
                    </LoadingButton>
                </WrapperButtonStyle>
            </RootStyle>
        </AuthWrapper>
    );
}
