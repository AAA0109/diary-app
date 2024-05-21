import { SocialError } from 'core/domain/common/socialError';
import { IUserSettingService } from 'core/services/users/IUserSettingService';
import { injectable, inject } from 'inversify';
import type { IHttpService } from 'core/services/webAPI/IHttpService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { UserSetting } from 'core/domain/users/userSetting';
import { Map } from 'immutable';

/**
 * Firbase userSetting service
 */
@injectable()
export class UserSettingService implements IUserSettingService {
    @inject(SocialProviderTypes.HttpService) private _httpService: IHttpService;

    public updateUserSetting = async (userSetting: any) => {
        try {
            await this._httpService.post('settings', userSetting);
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public getUserSettings = async () => {
        try {
            const { userSetting } = await this._httpService.get(`settings`);
            let parsedData: Map<string, any> = Map({});
            Object.keys(userSetting).forEach((key: any) => {
                parsedData = parsedData.set(key, userSetting[key]);
            });
            return parsedData;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };
}
