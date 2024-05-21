import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Paper from '@mui/material/Paper';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { Map } from 'immutable';
import React, { useEffect, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { UserSettingEnum } from 'constants/userSettingEnum';
import { INotificationSettingProps } from './INotificationSettingProps';
import { useStyles } from './notificationSettingStyles';
import { styled } from '@mui/styles';
import { Box, IconButton, Theme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { CloseRounded } from '@mui/icons-material';

const RootStyle = styled(Box)(() => ({
    padding: "0 4px",
}));

const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
    width: 57,
    height: 32,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: '3px 5px',
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(22px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: '#469AD0',
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#469AD0',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color: 'gray',
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.7,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
        transition: 'background-color opacity .5s, opacity opacity .5s',
    },
    '& .MuiSwitch-track': {
        borderRadius: 16,
        backgroundColor: '#469AD080',
        transition: 'background-color .5s, opacity .5s',
    },
}));

const HRStyle = styled('hr')(() => ({
    borderColor: "#E4E4E4",
    borderWidth: 1.5,
    opacity: 0.1,
    margin: "20px 16px",
}));

const HeaderStyle = styled('p')(() => ({
    fontSize: 14,
    fontWeight: 600,
    margin: "10px 16px",
}));

const DescriptionStyle = styled('p')(() => ({
    fontSize: 12,
    fontWeight: 400,
    margin: "0 16px",
}));

const SpecialReminderStyle = styled('div')(() => ({
    backgroundColor: "#469AD005",
    padding: "12px 2px",
    borderRadius: 16,
    margin: "16px",
}));

const WrapperButtonStyle = styled('div')(({ theme }: { theme: Theme }) => ({
    position: 'relative',
    width: '100%',
    margin: "10px auto",
    [theme.breakpoints.up('sm')]: {
        maxWidth: 400,
        minWidth: 320,
    },
}));

export function NotificationSettingComponent(props: INotificationSettingProps & WithTranslation) {
    const [checked, setChecked] = useState(props.userSettings);
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    /**
     * Handle check toggle
     */
    const handleToggle = (value: string) => () => {
        const isChecked = checked.get(value, true);
        setChecked(checked.set(value, !isChecked));
    };

    useEffect(() => {
        setChecked(props.userSettings);
    }, [props.userSettings])

    /**
     * Handle save changes
     */
    const handleSaveChanges = () => {
        const { updateUserSetting } = props;
        if (updateUserSetting) {
            updateUserSetting(checked);
        }
        else {
            enqueueSnackbar('This feature is not available yet', {
                variant: 'warning',
                action: (key) => (
                    <IconButton size="small" onClick={() => closeSnackbar(key)}>
                        <CloseRounded />
                    </IconButton>
                ),
            });
        }
    };

    const { t } = props;

    return (
        <RootStyle>
            <List>
                <ListItem>
                    <ListItemText
                        primary="Allow Notification Ring"
                        primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                        secondary="Helps you to get notified"
                        secondaryTypographyProps={{
                            fontSize: 12,
                            fontWeight: 400,
                        }}
                    />
                    <ListItemIcon>
                        <IOSSwitch
                            onChange={handleToggle(UserSettingEnum.allow_notification_ring)}
                            checked={Boolean(checked.get(UserSettingEnum.allow_notification_ring, false))}
                        />
                    </ListItemIcon>
                </ListItem>
                <HRStyle />
                <HeaderStyle>Auto Reminder</HeaderStyle>
                <DescriptionStyle>
                    This feature helps you to maintain your dairy timely and it will send you a reminder regular basis to post in your dairy.
                </DescriptionStyle>
                <SpecialReminderStyle>
                    <ListItem>
                        <ListItemText
                            primary="Daily Dairy Reminder"
                            primaryTypographyProps={{
                                fontSize: 14,
                                fontWeight: 500,
                            }}
                        />
                        <ListItemIcon>
                            <IOSSwitch
                                onChange={handleToggle(UserSettingEnum.daily_diary_reminder)}
                                checked={Boolean(checked.get(UserSettingEnum.daily_diary_reminder, true))}
                                disabled={!checked.get(UserSettingEnum.allow_notification_ring, true)}
                            />
                        </ListItemIcon>
                    </ListItem>
                </SpecialReminderStyle>
                <HRStyle />
                <ListItem>
                    <ListItemText
                        primary="Family Notification"
                        primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                        secondary="Allow family dairy notification."
                        secondaryTypographyProps={{
                            fontSize: 12,
                            fontWeight: 400,
                        }}
                    />
                    <ListItemIcon>
                        <IOSSwitch
                            onChange={handleToggle(UserSettingEnum.family_notification)}
                            checked={Boolean(checked.get(UserSettingEnum.family_notification, true))}
                            disabled={!checked.get(UserSettingEnum.allow_notification_ring, true)}
                        />
                    </ListItemIcon>
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Message & Comments"
                        primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                        secondary="Allow push notification."
                        secondaryTypographyProps={{
                            fontSize: 12,
                            fontWeight: 400,
                        }}
                    />
                    <ListItemIcon>
                        <IOSSwitch
                            onChange={handleToggle(UserSettingEnum.post_comments_notification)}
                            checked={Boolean(checked.get(UserSettingEnum.post_comments_notification, true))}
                            disabled={!checked.get(UserSettingEnum.allow_notification_ring, true)}
                        />
                    </ListItemIcon>
                </ListItem>
            </List>
            <CardActions className={classes.cardActions}>
                <WrapperButtonStyle>
                    <LoadingButton
                        tabIndex={3}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        // loading={isSubmitting}
                        onClick={handleSaveChanges}
                        style={{ padding: "16px 0", fontSize: "18px", fontWeight: 700, borderRadius: 18, fontFamily: 'Montserrat', }}
                    >
                        {t('config.saveChangesButton')}
                    </LoadingButton>
                </WrapperButtonStyle>
            </CardActions>
        </RootStyle>
    );
}

const translateWrapper = withTranslation('translations')(NotificationSettingComponent);
export default translateWrapper;
