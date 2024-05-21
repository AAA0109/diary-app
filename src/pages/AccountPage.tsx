import LanguageIcon from '@mui/icons-material/Language';
import NotificationIcon from '@mui/icons-material/Notifications';
import React, { useEffect, useRef, useState } from 'react';
import { AntTab, AntTabs } from 'components/tab';
import { LangSettingComponent } from 'containers/langSetting';
import useLocales from 'hooks/useLocales';
import { setHeaderTitle, setNavigationStep } from 'redux/actions/globalActions';
import { useDispatch, useSelector } from 'react-redux';
// import { useDispatch, useSelector } from 'redux/store';
import { dbFetchUserSetting, dbUpdateUserSetting } from 'redux/actions/userSettingActions';
import { userSettingSelector } from 'redux/reducers/userSetting/userSettingSelector';
import { styled } from '@mui/styles';
import { ConfigComponentType } from '../constants/configComponentType';
import NotificationSettingComponent from '../containers/notificationSetting';
import SettingsGadgetImage from '../assets/images/settings-gadget.png';
import Header from 'components/header/Header';
import Bounty from 'components/bounty/Bounty';
import UserAvatar from 'components/userAvatar/UserAvatarComponent';
import useAuth from 'hooks/useAuth';
import { MenuItem, Select } from '@mui/material';
import { EmotionList } from 'constants/emtionList';
import ChevronDownIcon from 'components/icons/ChevronDownIcon';
import { AccountSettingComponent } from 'containers/accountSetting';
// ----------------------------------------------------------------------
import * as globalActions from 'redux/actions/globalActions';
import ThemeSettingComponent from 'containers/ThemeSetting';
import { ICommonService } from 'core/services/common/ICommonService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { provider } from 'socialEngine';
import CameraIcon from 'components/icons/CameraIcon';
import MyAvatar from 'components/MyAvatar';
import { globalSelector } from 'redux/reducers/global/globalSelector';

const RootStyle = styled('div')(() => ({
    padding: "24px 12px",
    margin: "0 auto",
    position: 'relative',
}));

const SettingsGadget = styled('img')(() => ({
    position: 'absolute',
    top: -30,
    right: -30,
    width: 300,
    height: 320,
}));

const AvatarPane = styled('div')(() => ({
    margin: "25px 0",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 50,
}));

const AvatarComponent = styled('div')(() => ({
    padding: "4px",
    borderRadius: "100%",
    backgroundColor: "#fff",
    zIndex: 1,
    position: "relative",
}));

const UserNameText = styled('p')(() => ({
    fontSize: 20,
    fontWeight: 600,
    marginTop: 15,
}));

const SelectBox = styled(Select)(() => ({
    width: "100%",
    backgroundColor: '#F5FAFC !important',
    '& .MuiSelect-select': {
        padding: "16.5px 20px",
    },
    '& fieldset': {
        border: 'none',
    },
}));

const FileInputStyle = styled('div')(() => ({
    position: 'absolute',
    right: 4,
    bottom: 8,
    width: 32,
    height: 32,
    borderRadius: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#469AD0',
    '& input': {
        display: 'none',
    },
}));

// ----------------------------------------------------------------------

// selectors
const selectUserSetting = userSettingSelector.selectUserSetting();
const commonService: ICommonService = provider.get<ICommonService>(SocialProviderTypes.CommonService);
const selectEmotion = globalSelector.selectEmotion();

export default function AccountPage() {
    const { t } = useLocales();
    const dispatch = useDispatch();
    const { user, updateProfile } = useAuth();
    const inputRef = useRef<HTMLInputElement>(null);

    const [selectedItem, setSelectedItem] = React.useState(ConfigComponentType.Account);

    const userSetting = useSelector(selectUserSetting);

    const updateUserSetting = (setting: object) => dispatch<any>(dbUpdateUserSetting(setting));

    const setEmotion = (emotion: string) => dispatch<any>(globalActions.setEmotion(emotion));
    const emotion = useSelector((state: any) => selectEmotion(state)) as string;

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setSelectedItem(newValue);
    };

    useEffect(() => {
        if (user?.guardianId) {
            dispatch<any>(setNavigationStep(4));
        }
        dispatch<any>(setHeaderTitle(t('header.account')));
        dispatch<any>(dbFetchUserSetting());
    }, []);

    const handleChangeEmotion = (event: any) => {
        setEmotion(event.target.value as string);
    }

    const handleFileUpload = async (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const res = await commonService.fileUpload(file);
            await updateProfile({
                avatar: res.url,
            });
        }
    };

    const handleClickUploadButton = () => {
        inputRef.current?.click();
    }

    return (
        <RootStyle>
            <SettingsGadget src={SettingsGadgetImage} />
            <Header trailing={
                // <Bounty />
                <></>
            } />
            <AvatarPane>
                <AvatarComponent>
                    <MyAvatar size={120} fontSize="60px" />
                    <FileInputStyle onClick={handleClickUploadButton}>
                        <CameraIcon />
                        <input ref={inputRef} type="file" accept=".jpg, .jpeg, .png" onChange={handleFileUpload} />
                    </FileInputStyle>
                </AvatarComponent>
                <UserNameText>{user?.fullName}</UserNameText>
            </AvatarPane>
            <SelectBox
                value={emotion}
                onChange={handleChangeEmotion}
                IconComponent={(props: JSX.IntrinsicAttributes & { [x: string]: any; }) => {
                    return (
                        <ChevronDownIcon {...props} style={{ right: 16, top: "calc(50% - 10px)" }} />
                    );
                }}
            >
                {EmotionList.map((item) => (
                    <MenuItem value={item.key} key={item.key}>{item.text}</MenuItem>
                ))}
            </SelectBox>
            <AntTabs value={selectedItem} onChange={handleChange} aria-label="ant example" style={{ marginTop: "20px" }}>
                <AntTab label="Account" />
                <AntTab label={t('config.notificationTab')} />
                <AntTab label="Language" />
                {/* <AntTab label="Theme" /> */}
            </AntTabs>
            <div style={{ height: 10 }} />
            {selectedItem === ConfigComponentType.Account ? (
                <AccountSettingComponent />
            ) : (selectedItem === ConfigComponentType.Notification ? (
                <NotificationSettingComponent updateUserSetting={updateUserSetting} userSettings={userSetting} />
            ) : (selectedItem === ConfigComponentType.Language ? (
                <LangSettingComponent updateUserSetting={updateUserSetting} userSettings={userSetting} />
            ) : (
                <ThemeSettingComponent updateUserSetting={updateUserSetting} userSettings={userSetting} />
            )))}
        </RootStyle>
    );
}
