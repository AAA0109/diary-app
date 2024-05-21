import { UserSettingActionType } from 'constants/userSettingActionType';
import { IUserSettingService } from 'core/services/users/IUserSettingService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { Map } from 'immutable';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { provider } from 'socialEngine';
import * as globalActions from 'redux/actions/globalActions';
import * as userSettingActions from 'redux/actions/userSettingActions';
import { authorizeSelector } from 'redux/reducers/authorize/authorizeSelector';
import { UserSetting } from 'core/domain/users/userSetting';
import { AuthAPI } from 'api/AuthAPI';
import i18n from 'locales/i18n';

interface UserSettingAction {
    type: string;
    payload: {
        setting: Map<string, { toJS: () => { value: any } }>;
        lang: string;
    };
}

/**
 * Get service providers
 */
const userSettingService: IUserSettingService = provider.get<IUserSettingService>(
    SocialProviderTypes.UserSettingService,
);

/** *************************** Subroutines *********************************** */

/**
 * Fetch user setting
 */
function* dbFetchUserSetting(): any {
    try {
        const result = yield call(userSettingService.getUserSettings);
        yield put(userSettingActions.setUserSetting(result));
    } catch (error: any) {
        yield put(globalActions.showMessage(error.message));
    }
}

/**
 * Update user setting
 */
function* dbUpdateUserSetting(action: UserSettingAction) {
    const { payload } = action;
    try {
        const apiPayload = {};
        payload.setting.forEach((item: any, key: string) => {
            apiPayload[key] = item;
        });
        yield call(userSettingService.updateUserSetting, apiPayload);
        yield put(userSettingActions.updateUserSetting(payload.setting));
    } catch (error: any) {
        yield put(globalActions.showMessage(error.message));
    }
}

/**
 * Change current user language
 */
function* changeCurrentLang(action: any) {
    const { lang } = action.payload;
    AuthAPI.createCookie('social-lang', lang, 100000);
    i18n.changeLanguage(lang || 'en');
    yield;
}

/**
 * Set current user language from cookie
 */
function* SetCurrentLangFromCookie() {
    const lang = AuthAPI.readCookie('social-lang');
    i18n.changeLanguage(lang || 'en');
    yield;
}

export default function* userSettingSaga() {
    yield all([
        takeLatest(UserSettingActionType.DB_FETCH_USER_SETTING, dbFetchUserSetting),
        takeLatest(UserSettingActionType.DB_UPDATE_USER_SETTING, dbUpdateUserSetting),
        takeLatest(UserSettingActionType.SET_CURRENT_LANG_FROM_COOKIE, SetCurrentLangFromCookie),
        takeLatest(UserSettingActionType.CHANGE_CURRENT_LANG, changeCurrentLang),
    ]);
}
