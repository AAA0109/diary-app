/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { createStyles, makeStyles, styled } from '@mui/styles';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { Theme } from '@mui/material/styles';
import useDiary from 'hooks/useDiary';

import { IFilterDiariesModalProps } from './IFilterDiariesModalProps';
import RetryIcon from 'components/icons/RetryIcon';
import { useSnackbar } from 'notistack';
import { SortByFilterList } from 'constants/sortByFilterList';

const BootstrapDialog = styled(Dialog)(({ theme }: { theme: Theme }) => ({
    '& .MuiPaper-root': {
        width: '640px',
        margin: '16px',
        padding: '12px',
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
            marginBottom: '24px',
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
    padding: "12px 0",
    fontSize: "16px",
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
}));

const ActionGroup = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    gap: '4px',
}))

const FormGroupLabel = styled(Typography)(({ theme }) => ({
    fontSize: '14px',
    fontWeight: 400,
    color: '#56605F',
    opacity: .8,
    marginBottom: '4px',
    marginTop: '4px',
}))

export function FilterDiariesModal(props: IFilterDiariesModalProps) {
    const classes = useStyles();
    const { t } = useTranslation();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [sortBy, setSortBy] = useState<string>(props.sortBy);
    const [topicFilter, setTopicFilter] = useState<string>(props.topicFilter);

    const { topicList, loadingDiaryList } = useDiary();

    const handleClose = () => {
        setSortBy(props.sortBy);
        setTopicFilter(props.topicFilter);
        props.handleClose();
    }

    const handleChangeSortBy = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSortBy(event.target.value);
    }

    const handleChangeTopicFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTopicFilter(event.target.value);
    }

    const applyFilter = () => {
        props.applyFilter(sortBy, topicFilter);
        props.handleClose();
    }

    const clearFilter = () => {
        setSortBy('recent');
        setTopicFilter('');
        props.applyFilter('recent', '');
        props.handleClose();
    }

    useEffect(() => {
        clearFilter();
    }, []);

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                Diaries Filters
                <Typography fontSize="14px" fontWeight="400" paddingY="4px">
                    Apply filters as per your preference
                </Typography>
            </BootstrapDialogTitle>
            <DialogContent style={{ paddingBottom: 0 }}>
                <FormControl component="div" required className={classes.formControl}>
                    <FormGroupLabel>
                        Sort by
                    </FormGroupLabel>
                    <RadioGroup
                        aria-label="selectedTopic"
                        name="selectedTopic"
                        className={classes.group}
                        value={sortBy}
                        onChange={handleChangeSortBy}
                    >
                        {SortByFilterList.map((e, i) => (
                            <FormControlLabel
                                key={i}
                                className={classes.permissionItem}
                                value={e.id}
                                control={<Radio />}
                                label={
                                    <Typography fontSize="16px" fontWeight="700" style={{ opacity: e.id.toString() === sortBy.toString() ? 1 : .5, }}>
                                        {e.text}
                                    </Typography>
                                }
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
                <FormControl component="div" required className={classes.formControl}>
                    <FormGroupLabel>
                        Filter by topics
                    </FormGroupLabel>
                    <RadioGroup
                        aria-label="selectedTopic"
                        name="selectedTopic"
                        className={classes.group}
                        value={topicFilter}
                        onChange={handleChangeTopicFilter}
                    >
                        {topicList.map((e, i) => (
                            <FormControlLabel
                                key={i}
                                className={classes.permissionItem}
                                value={e.id}
                                control={<Radio />}
                                label={
                                    <Typography fontSize="16px" fontWeight="700" style={{ opacity: e.id?.toString() === topicFilter.toString() ? 1 : .5, }}>
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
                    <BootstrapButton onClick={clearFilter} variant='contained' color="error">
                        Clear Filters
                    </BootstrapButton>
                    <BootstrapButton onClick={applyFilter} variant='contained' disabled={loadingDiaryList}>
                        Apply Filters
                    </BootstrapButton>
                </ActionGroup>
            </DialogActions>
        </BootstrapDialog>
    );
}

export default FilterDiariesModal;
