/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { createStyles, makeStyles, styled } from '@mui/styles';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, FormControl, RadioGroup, FormControlLabel, Radio, Checkbox } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { Theme } from '@mui/material/styles';

import { IFilterForumsModalProps } from './IFilterForumsModalProps';

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
            margin: '4px 0',
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

const ActionGroup = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    gap: '12px',
}))

const FormGroupLabel = styled(Typography)(({ theme }) => ({
    fontSize: '14px',
    fontWeight: 400,
    color: '#56605F',
    opacity: .8,
    marginBottom: '4px',
    marginTop: '4px',
}))

export function FilterForumsModal(props: IFilterForumsModalProps) {
    const classes = useStyles();
    const { t } = useTranslation();
    const [forumFilter, setTopicFilter] = useState<string[]>(props.topicFilter);

    const handleClose = () => {
        setTopicFilter(forumFilter);
        props.handleClose();
    }

    const handleChangeTopicFilter = (event: any) => {
        if (forumFilter.includes(event.target.value)) {
            setTopicFilter(forumFilter.filter((e) => e !== event.target.value));
        }
        else {
            setTopicFilter([...forumFilter, event.target.value]);
        }
    }

    const applyFilter = () => {
        props.applyFilter(forumFilter);
        props.handleClose();
    }

    const clearFilter = () => {
        setTopicFilter([]);
        props.applyFilter([]);
        props.handleClose();
    }

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={props.open}
        >
            <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                Forum Filters
                <Typography fontSize="14px" fontWeight="400" paddingY="4px">
                    Apply filters as per your preference
                </Typography>
            </BootstrapDialogTitle>
            <DialogContent style={{ paddingBottom: 0 }}>
                <FormControl component="div" required className={classes.formControl}>
                    <FormGroupLabel>
                        Filter by forum
                    </FormGroupLabel>
                    <Box className={classes.group} display='flex' flexDirection='column'>
                        {props.forums.map((e, i) => (
                            <FormControlLabel
                                key={i}
                                className={classes.permissionItem}
                                value={e.id}
                                onChange={(e) => handleChangeTopicFilter(e)}
                                checked={forumFilter.includes(e.id!.toString())}
                                control={<Checkbox />}
                                label={
                                    <Typography fontSize="16px" fontWeight="700" style={{ opacity: e.id?.toString() === forumFilter.toString() ? 1 : .5, }}>
                                        {e.title}
                                    </Typography>
                                }
                            />
                        ))}
                    </Box>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <ActionGroup>
                    <BootstrapButton onClick={clearFilter} variant='contained' color="error">
                        Clear Filters
                    </BootstrapButton>
                    <BootstrapButton onClick={applyFilter} variant='contained'>
                        Apply Filters
                    </BootstrapButton>
                </ActionGroup>
            </DialogActions>
        </BootstrapDialog>
    );
}

export default FilterForumsModal;
