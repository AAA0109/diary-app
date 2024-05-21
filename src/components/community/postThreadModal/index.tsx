/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { createStyles, makeStyles, styled } from '@mui/styles';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, FormControl, RadioGroup, FormControlLabel, Radio, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { Theme } from '@mui/material/styles';
import * as Yup from 'yup';

import { IPostThreadModalProps } from './IPostThreadModalProps';
import { useSnackbar } from 'notistack';
import useIsMountedRef from 'hooks/useIsMountedRef';
import { Form, FormikProvider, useFormik } from 'formik';
import PinIcon from 'components/icons/PinIcon';
import { ICommonService } from 'core/services/common/ICommonService';
import { provider } from 'socialEngine';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { ICommunityService } from 'core/services/community/ICommunityService';
import { useNavigate, useParams } from 'react-router';
import { PATH_MAIN } from 'routes/paths';

const commonService: ICommonService = provider.get<ICommonService>(SocialProviderTypes.CommonService);
const communityService: ICommunityService = provider.get<ICommunityService>(SocialProviderTypes.CommunityService);

export function PostThreadModal(props: IPostThreadModalProps) {
    const classes = useStyles();
    const { t } = useTranslation();
    const { subforumId } = useParams();
    const navigator = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState<string>('');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const isMountedRef = useIsMountedRef();
    const inputRef = useRef<HTMLInputElement>(null);

    const familyMotoSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        content: Yup.string().required('Content is required'),
    });

    const formik = useFormik({
        initialValues: {
            title: '',
            content: '',
        },
        validationSchema: familyMotoSchema,
        onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
            try {
                let link = '';
                if (inputRef.current?.files?.[0]) {
                    link = await handleFileUpload();
                }
                const res = await communityService.postThread({ title: values.title, content: values.content, subforumId: parseInt(subforumId!, 2), link, filename: fileName });
                enqueueSnackbar('Thread is posted successfully', {
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
                if (res.thread?.id) {
                    navigator(PATH_MAIN.community.thread(res.thread?.id))
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

    const handleClose = () => {
        props.handleClose();
    }

    const handleFileSelect = async (event: any) => {
        const file = event.target.files[0];
        setFileName(file?.name ?? '');
    };

    const handleFileUpload = async () => {
        const file = inputRef.current?.files?.[0];
        if (file) {
            const res = await commonService.fileUpload(file);
            return res.url;
        }
        return '';
    };

    const handleClickUploadButton = () => {
        inputRef.current?.click();
    }

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                Post New Thread
            </BootstrapDialogTitle>
            <FormikProvider value={formik}>
                <FormStyle autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <DialogContent>
                        <FormControl component="div" required className={classes.formControl}>
                            <AuthTextField
                                fullWidth
                                type="text"
                                placeholder="Thread Title"
                                {...getFieldProps('title')}
                                error={Boolean(touched.title && errors.title)}
                                helperText={touched.title && errors.title}
                                tabIndex={1}
                            />
                        </FormControl>
                        <FormControl component="div" required className={classes.formControl}>
                            <AuthTextArea
                                fullWidth
                                type='text'
                                multiline
                                rows={3}
                                placeholder="Thread Content"
                                {...getFieldProps('content')}
                                error={Boolean(touched.content && errors.content)}
                                helperText={touched.content && errors.content}
                                tabIndex={2}
                            />
                        </FormControl>
                        <FileUploadPane>
                            <PinIcon style={{ cursor: 'pointer' }} onClick={handleClickUploadButton} />
                            <input ref={inputRef} type="file" accept="*" onChange={handleFileSelect} />
                            <Typography>{fileName}</Typography>
                        </FileUploadPane>
                    </DialogContent>
                    <DialogActions>
                        <ActionGroup>
                            <BootstrapButton type="submit" variant='contained' disabled={isLoading}>
                                Post Thread
                            </BootstrapButton>
                        </ActionGroup>
                    </DialogActions>
                </FormStyle>
            </FormikProvider>
        </BootstrapDialog>
    );
}

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2, pb: 0, }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 16,
                        top: 24,
                        background: '#F6FAFD',
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon color='primary' />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

const BootstrapButton = styled(Button)(({ theme }) => ({
    width: '100%',
    margin: '6px',
    padding: "16px 0",
    fontSize: "18px",
    fontWeight: 700,
    borderRadius: 18,
    fontFamily: 'Montserrat',
}));

const ActionGroup = styled(Box)(({ theme }) => ({
    width: '100%',
}))

const BootstrapDialog = styled(Dialog)(({ theme }: { theme: Theme }) => ({
    '& .MuiPaper-root': {
        width: '640px',
        margin: '16px',
        padding: 16,
        [theme.breakpoints.down('xs')]: {
            width: '100%',
        },
    },
    '& .MuiDialogContent-root': {
        padding: 16,
    },
    '& .MuiDialogActions-root': {
        padding: "8px 16px",
    },
}));

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
            margin: "8px 0",
        },
        permissionItem: {
            fontSize: 15,
        },
    }),
);

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

const FormStyle = styled(Form)(() => ({
    textAlign: 'center',
    display: 'block',
    margin: 'auto',
}));

const FileUploadPane = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
}))

export default PostThreadModal;
