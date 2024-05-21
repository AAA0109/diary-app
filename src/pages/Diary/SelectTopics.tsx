import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';

import classNames from 'classnames';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { Theme } from '@mui/material/styles/createTheme';
import { createStyles, makeStyles } from '@mui/styles';
import { Box, Button, Checkbox, CircularProgress, LinearProgress, Typography, circularProgressClasses, linearProgressClasses, styled } from '@mui/material';
import AddIcon from '@mui/icons-material/AddRounded';
import { useEffect, useState } from 'react';
import useDiary from 'hooks/useDiary';
import { useNavigate } from 'react-router-dom';
import { PATH_MAIN } from 'routes/paths';
import { useSnackbar } from 'notistack';
import * as globalActions from 'redux/actions/globalActions';
import { useDispatch } from 'react-redux';

export default function SelectTopics() {
    const { t } = useTranslation();
    const classes = useStyles();
    const mdDownHidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    // const { topicList, selectedTopics, onSelectTopics } = useDiary();
    const navigate = useNavigate();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const dispatch = useDispatch();
    const setNavigationStep = (step: number) => dispatch<any>(globalActions.setNavigationStep(step));

    const handleNext = () => {
        // if (selectedTopics?.length === 0) return enqueueSnackbar('Please select at least one topic', { variant: 'warning' });
        navigate(PATH_MAIN.diary.post);
    }

    useEffect(() => {
        setNavigationStep(1);
    }, []);

    return (
        <Grid container justifyContent="space-around" spacing={3}>
            <Grid className={classNames(classes.gridItem, classes.postGrid)} xs={12} md={8} item>
                <Typography className={classes.title}>
                    {t('diaryTopic.title')}
                </Typography>
                <Typography className={classes.subtitle}>
                    {t('diaryTopic.subtitle')}
                </Typography>
                {/* <Box>
                    {(topicList ?? []).map(e => (
                        <Box className={classes.topicPane} key={e.id}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant='h4' lineHeight={1.6} fontWeight={600}>
                                    {e.name}
                                </Typography>
                                <Typography variant='subtitle2' color="#999" >
                                    {e.description}
                                </Typography>
                            </Box>
                            <Checkbox checked={selectedTopics?.indexOf(e.id!.toString()) >= 0} name={e.id?.toString()} onChange={onSelectTopics} />
                        </Box>
                    ))}
                </Box> */}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button variant="contained" color="secondary" className={classes.startBtn} onClick={handleNext}>
                        Get Started
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
}

// ----------------------------------------------------------------------

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
        subtitle: {
            fontSize: "16px",
            color: "#3366FF",
            marginBottom: "30px",
            [theme.breakpoints.down('md')]: {
                fontSize: "12px",
            },
        },
        topicPane: {
            display: "flex",
            margin: "25px 0",
            [theme.breakpoints.down('md')]: {
                margin: "15px 0",
            },
            alignItems: "center",
        },
        startBtn: {
            borderRadius: "20px",
            fontSize: "16px",
            padding: "10px 30px",
            margin: "25px 0",
        }
    }),
);
