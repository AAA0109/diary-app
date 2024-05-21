import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Paper from '@mui/material/Paper';
import { Map } from 'immutable';
import React from 'react';

import FormControl from '@mui/material/FormControl/FormControl';
import InputLabel from '@mui/material/InputLabel/InputLabel';
import MenuItem from '@mui/material/MenuItem/MenuItem';
import { Box, CardContent, IconButton, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Switch, SwitchProps, Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as userSettingActions from 'redux/actions/userSettingActions';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useStyles } from './langSettingStyles';
import { ILangSettingProps } from './ILangSettingProps';
import { styled } from '@mui/styles';
import ChevronDownIcon from 'components/icons/ChevronDownIcon';
import TranslateIcon from 'components/icons/TranslateIcon';
import { UserSettingEnum } from 'constants/userSettingEnum';
import { LoadingButton } from '@mui/lab';
import { CloseRounded } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

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

export function LangSettingComponent(props: ILangSettingProps) {
    const [selectedLang, setSelectedLang] = React.useState(props.userSettings.get('lang', Map({})));
    const classes = useStyles();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [checked, setChecked] = React.useState(props.userSettings.get('notification', Map({})));
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleChange = (event: any) => {
        setSelectedLang(selectedLang.setIn(['current', 'value'], event?.target.value as string));
    };

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
                        primary="Change Application Language"
                        primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                        secondary="Helps you to better understand"
                        secondaryTypographyProps={{
                            fontSize: 12,
                            fontWeight: 400,
                        }}
                    />
                </ListItem>
                <SelectBox
                    value={selectedLang.getIn(['current', 'value'], 'English')}
                    onChange={handleChange}
                    IconComponent={(props) => {
                        return (
                            <ChevronDownIcon {...props} style={{ right: 16, top: "calc(50% - 8px)" }} />
                        );
                    }}
                    renderValue={(value: any) => {
                        return (
                            <Box sx={{ display: "flex", gap: 1, alignItems: "center", fontSize: "18px", fontWeight: 400 }}>
                                <TranslateIcon color="#637381" />
                                {value}
                            </Box>
                        );
                    }}
                >
                    <MenuItem value={'English'}>English</MenuItem>
                    <MenuItem value={'Korean'}>Korean</MenuItem>
                </SelectBox>
                <ListItem>
                    <ListItemText
                        primary="Allow Auto Translation"
                        primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                        secondary="Translate any language"
                        secondaryTypographyProps={{
                            fontSize: 12,
                            fontWeight: 400,
                        }}
                    />
                    <ListItemIcon>
                        <IOSSwitch
                            onChange={handleToggle(UserSettingEnum.auto_translation)}
                            checked={checked.getIn([UserSettingEnum.auto_translation, 'value'], 'true') === 'true'}
                        />
                    </ListItemIcon>
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Random Dairy Topic"
                        primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                        secondary="Allow App to give random topics"
                        secondaryTypographyProps={{
                            fontSize: 12,
                            fontWeight: 400,
                        }}
                    />
                    <ListItemIcon>
                        <IOSSwitch
                            onChange={handleToggle(UserSettingEnum.random_diary_topic)}
                            checked={checked.getIn([UserSettingEnum.random_diary_topic, 'value'], 'true') === 'true'}
                        />
                    </ListItemIcon>
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary="Define Own Words"
                        primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                        secondary="Allow App to define your own words"
                        secondaryTypographyProps={{
                            fontSize: 12,
                            fontWeight: 400,
                        }}
                    />
                    <ListItemIcon>
                        <IOSSwitch
                            onChange={handleToggle(UserSettingEnum.define_own_words)}
                            checked={checked.getIn([UserSettingEnum.define_own_words, 'value'], 'true') === 'true'}
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

export default LangSettingComponent;
