import CardActions from '@mui/material/CardActions';
import { Map } from 'immutable';
import React from 'react';

import { Box, CardContent, IconButton, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Switch, SwitchProps, Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { IThemeSettingProps } from './IThemeSettingProps';
import { styled } from '@mui/styles';
import { UserSettingEnum } from 'constants/userSettingEnum';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { CloseRounded } from '@mui/icons-material';

const RootStyle = styled(Box)(() => ({
    padding: "0 4px",
}));

const SelectBox = styled(Select)(() => ({
    width: "100%",
    margin: "12px 0",
    backgroundColor: '#F5FAFC !important',
    '& .MuiSelect-select': {
        padding: "16.5px 20px",
    },
    '& fieldset': {
        border: 'none',
    },
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

const WrapperButtonStyle = styled('div')(({ theme }: { theme: Theme }) => ({
    position: 'relative',
    width: '100%',
    margin: "10px auto",
    [theme.breakpoints.up('sm')]: {
        maxWidth: 400,
        minWidth: 320,
    },
}));

export function ThemeSettingComponent(props: IThemeSettingProps) {
    const [selectedLang, setSelectedLang] = React.useState(props.userSettings.get('lang', Map({})));
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [checked, setChecked] = React.useState(props.userSettings.get('notification', Map({})));
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    /**
     * Handle save changes
     */
    const handleSaveChanges = () => {
        // const { updateUserSetting } = props;
        // dispatch<any>(userSettingActions.changeCurrentLang(selectedLang.getIn(['current', 'value'], 'English')));
        // updateUserSetting('lang', selectedLang);
        enqueueSnackbar('This feature is not available yet', {
            variant: 'warning',
            action: (key) => (
                <IconButton size="small" onClick={() => closeSnackbar(key)}>
                    <CloseRounded />
                </IconButton>
            ),
        });
    };

    /**
     * Handle check toggle
     */
    const handleToggle = (value: any) => () => {
        const isChecked = checked.getIn([value, 'value'], 'true');

        if (isChecked === 'true') {
            setChecked(checked.setIn([value, 'value'], 'false'));
        } else {
            setChecked(checked.setIn([value, 'value'], 'true'));
        }
    };

    return (
        <RootStyle>
            <List>
                <ListItem>
                    <ListItemText
                        primary="Auto Theme Adjustment"
                        primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                        secondary="Make theme default as phone"
                        secondaryTypographyProps={{
                            fontSize: 12,
                            fontWeight: 400,
                        }}
                    />
                    <ListItemIcon>
                        <IOSSwitch
                            onChange={handleToggle(UserSettingEnum.auto_theme_adjustment)}
                            checked={checked.getIn([UserSettingEnum.auto_theme_adjustment, 'value'], 'true') === 'true'}
                        />
                    </ListItemIcon>
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Enable Eye Saving"
                        primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                        secondary="Allow this feature"
                        secondaryTypographyProps={{
                            fontSize: 12,
                            fontWeight: 400,
                        }}
                    />
                    <ListItemIcon>
                        <IOSSwitch
                            onChange={handleToggle(UserSettingEnum.enable_eye_saving)}
                            checked={checked.getIn([UserSettingEnum.enable_eye_saving, 'value'], 'true') === 'true'}
                        />
                    </ListItemIcon>
                </ListItem>
            </List>
            <CardActions>
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

export default ThemeSettingComponent;
