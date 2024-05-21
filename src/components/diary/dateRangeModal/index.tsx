import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, styled } from '@mui/styles';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { Theme } from '@mui/material/styles';

import { IDateRangeModalProps } from './IDateRangeModalProps';
import { useSnackbar } from 'notistack';
import dayjs, { Dayjs } from 'dayjs';
import { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts';
import { DateRange, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';

const shortcutsItems: PickersShortcutsItem<DateRange<Dayjs>>[] = [
    {
        label: 'This Week',
        getValue: () => {
            const today = dayjs();
            return [today.startOf('week'), today.endOf('week')];
        },
    },
    {
        label: 'Last Week',
        getValue: () => {
            const today = dayjs();
            const prevWeek = today.subtract(7, 'day');
            return [prevWeek.startOf('week'), prevWeek.endOf('week')];
        },
    },
    {
        label: 'Last 7 Days',
        getValue: () => {
            const today = dayjs();
            return [today.subtract(7, 'day'), today];
        },
    },
    {
        label: 'Current Month',
        getValue: () => {
            const today = dayjs();
            return [today.startOf('month'), today.endOf('month')];
        },
    },
    {
        label: 'Last 30 Days',
        getValue: () => {
            const today = dayjs();
            return [today.subtract(30, 'day'), today];
        },
    },
    { label: 'Reset', getValue: () => [null, null] },
];

export function DateRangeModal(props: IDateRangeModalProps) {
    const classes = useStyles();
    const { t } = useTranslation();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs(props.startDate));
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs(props.endDate));

    const handleClose = () => {
        props.handleClose();
    }

    const handleConfirmDateRange = () => {
        if (startDate && endDate) {
            props.handleDateRangeChange([startDate.toDate(), endDate.toDate()]);
        }
        if (!startDate && !endDate) {
            props.handleDateRangeChange([null, null]);
        }
        if ((startDate && !endDate) || (!startDate && endDate)) {
            enqueueSnackbar('Please select a date range', {
                variant: 'error', action: (key) => (
                    <IconButton size="small" onClick={() => closeSnackbar(key)}>
                        <CloseIcon />
                    </IconButton>
                ),
            });
            return;
        }
        handleClose();
    }

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                Filter diaries by date
            </BootstrapDialogTitle>
            <DialogContent style={{ paddingBottom: 0 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StaticDateRangePicker
                        slotProps={{
                            shortcuts: {
                                items: shortcutsItems,
                            },
                            actionBar: { actions: [] },
                        }}
                        onChange={(date) => {
                            setStartDate(date[0]);
                            setEndDate(date[1]);
                        }}
                        calendars={2}
                        value={[startDate, endDate]}
                    />
                </LocalizationProvider>
            </DialogContent>
            <DialogActions>
                <ActionGroup>
                    <BootstrapButton onClick={handleClose} variant='contained' color="error">
                        Cancel
                    </BootstrapButton>
                    <BootstrapButton onClick={handleConfirmDateRange} variant='contained'>
                        Apply Filters
                    </BootstrapButton>
                </ActionGroup>
            </DialogActions>
        </BootstrapDialog>
    );
}

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

const ActionGroup = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    gap: '4px',
}))

const BootstrapButton = styled(Button)(({ theme }) => ({
    width: '100%',
    margin: '6px',
    padding: "16px 0",
    fontSize: "18px",
    fontWeight: 700,
    borderRadius: 18,
    fontFamily: 'Montserrat',
}));

export default DateRangeModal;
