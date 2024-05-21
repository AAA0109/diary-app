import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import * as Yup from 'yup';

import classNames from 'classnames';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { Theme } from '@mui/material/styles/createTheme';
import { createStyles, makeStyles } from '@mui/styles';
import { Box, Button, Checkbox, CircularProgress, IconButton, LinearProgress, TextareaAutosize, Typography, circularProgressClasses, linearProgressClasses, styled } from '@mui/material';
import AddIcon from '@mui/icons-material/AddRounded';
import { useEffect, useRef, useState } from 'react';
import useDiary from 'hooks/useDiary';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { Form, FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import useIsMountedRef from 'hooks/useIsMountedRef';
import { Diary } from 'core/domain/diary/diary';
import CloseIcon from '@mui/icons-material/CloseRounded';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { PATH_MAIN } from 'routes/paths';

export default function PostDiary() {
    const { t } = useTranslation();
    const classes = useStyles();
    const mdDownHidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    // const { selectedTopics, topicList, postDiary } = useDiary();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const isMountedRef = useIsMountedRef();
    const navigate = useNavigate();

    const DiarySchema = Yup.object().shape(
        Object.fromEntries(
            []
        )
    );

    const formik = useFormik({
        initialValues:
            Object.fromEntries(
                [
                    [
                        "date",
                        new Date(),
                    ]
                ]
            ),
        validationSchema: DiarySchema,
        onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
            try {
                // const { error } = await postDiary(values);
                // if (error) {
                //     enqueueSnackbar(error, {
                //         variant: 'error',
                //         action: (key) => (
                //             <IconButton size="small" onClick={() => closeSnackbar(key)}>
                //                 <CloseIcon />
                //             </IconButton>
                //         ),
                //     });
                // }
                // else {
                //     enqueueSnackbar('Diary is posted successfully', {
                //         variant: 'success',
                //         action: (key) => (
                //             <IconButton size="small" onClick={() => closeSnackbar(key)}>
                //                 <CloseIcon />
                //             </IconButton>
                //         ),
                //     });
                //     navigate(PATH_MAIN.user.home);
                // }
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
        <FormikProvider value={formik}>
            <FormStyle autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Grid container justifyContent="space-around" spacing={3}>
                    <Grid className={classNames(classes.gridItem, classes.postGrid)} xs={12} md={8} item>
                        <Typography className={classes.title}>
                            {t('diaryPost.title')}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <LoadingButton loading={isSubmitting} variant="contained" color="secondary" className={classes.postBtn} type="submit">
                                <PostAddIcon fontSize='medium' sx={{ marginRight: "8px" }} />
                                Post a diary
                            </LoadingButton>
                        </Box>
                    </Grid>
                </Grid>
            </FormStyle>
        </FormikProvider>
    );
}

// ----------------------------------------------------------------------

const FormStyle = styled(Form)(() => ({
    textAlign: 'center',
    display: 'block',
    margin: 'auto',
}));

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        gridItem: {
            padding: '24px !important',
            paddingLeft: '42px !important',
        },
        postGrid: {
            'max-width': '700px !important',
        },
        title: {
            fontSize: "32px",
            margin: "20px 0",
            [theme.breakpoints.down('md')]: {
                fontSize: "24px",
            },
        },
        diaryInput: {
            width: "100%",
            border: "none",
            boxShadow: "0 2px 8px 0 rgba(0,0,0,0.18)",
            fontSize: "20px",
            borderRadius: "12px",
            color: "#555",
            lineHeight: "1.5",
            marginTop: "20px",
            padding: "12px 18px",
            resize: "vertical",
            "&:focus": {
                outline: "none",
            }
        },
        errorText: {
            color: theme.palette.error.main,
            fontSize: "14px",
            fontWeight: 300,
            textAlign: "left",
            padding: "5px",
        },
        postBtn: {
            borderRadius: "20px",
            fontSize: "16px",
            padding: "10px 30px",
            margin: "25px 0",
            textTransform: "none",
        }
    }),
);
