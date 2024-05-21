import { Map } from 'immutable';

export interface INotificationSettingProps {
    /**
     * User setting
     */
    userSettings: Map<string, any>;

    /**
     * Update user setting
     */
    updateUserSetting: (setting: object) => any;
}
