/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { createStyles, makeStyles, styled } from '@mui/styles';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { Theme } from '@mui/material/styles';
import useDiary from 'hooks/useDiary';

import { ISelectTopicModalProps } from './IEnterFamilyModalProps';
import RetryIcon from 'components/icons/RetryIcon';
import { useSnackbar } from 'notistack';

const BootstrapDialog = styled(Dialog)(({ theme }: { theme: Theme }) => ({
    '& .MuiPaper-root': {
        width: '640px',
        margin: '16px',
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
            margin: "0 16px",
        },
        permissionItem: {
            fontSize: 15,
        },
    }),
);

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
                        top: 16,
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

const GenerateRandomTopicButton = styled(Button)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '12px auto',
    cursor: 'pointer',
    textTransform: 'none',
}));

const ActionGroup = styled(Box)(({ theme }) => ({
    width: '100%',
}))

export function SelectTopicModal(props: ISelectTopicModalProps) {
    const classes = useStyles();
    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState(false);
    const { topicList, selectedTopic, onSelectTopic } = useDiary();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleClose = () => {
        props.handleClose();
    }

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            if (!selectedTopic) {
                enqueueSnackbar("Select a diary topic.", {
                    variant: 'error',
                    action: (key) => (
                        <IconButton size="small" onClick={() => closeSnackbar(key)}>
                            <CloseIcon />
                        </IconButton>
                    ),
                });
            }
            else {
                handleClose();
            }
            setIsLoading(false);
        }
        catch (e) {
            setIsLoading(false);
        }
    }

    const handleInputChange = (event: any) => {
        const { target } = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        onSelectTopic(value);
    };

    const setRandomTopic = () => {
        const randomTopic = topicList[Math.floor(Math.random() * topicList.length)];
        console.log(randomTopic);
        onSelectTopic(randomTopic.id?.toString() ?? "");
    }

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                Select Diary Category
                <Typography fontSize="14px" fontWeight="400" paddingY="4px">
                    What you want to post about?
                </Typography>
            </BootstrapDialogTitle>
            <DialogContent>
                <FormControl component="div" required className={classes.formControl}>
                    <RadioGroup
                        aria-label="selectedTopic"
                        name="selectedTopic"
                        className={classes.group}
                        value={selectedTopic}
                        onChange={handleInputChange}
                    >
                        {topicList.map((e, i) => (
                            <FormControlLabel
                                key={i}
                                className={classes.permissionItem}
                                value={e.id}
                                control={<Radio />}
                                label={
                                    <Typography fontSize="16px" fontWeight="500" style={{ opacity: .5 }}>
                                        {e.name}
                                    </Typography>
                                }
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <ActionGroup>
                    <BootstrapButton onClick={handleSubmit} variant='contained' disabled={isLoading}>
                        Select Topic
                    </BootstrapButton>
                    <GenerateRandomTopicButton onClick={setRandomTopic}>
                        <RetryIcon color="#469AD0" style={{ marginRight: "8px" }} />
                        <Typography fontSize="16px" fontWeight="500" color="#26282C">
                            Pick a topic for me
                        </Typography>
                    </GenerateRandomTopicButton>
                </ActionGroup>
            </DialogActions>
        </BootstrapDialog>
    );
}

export default SelectTopicModal;
