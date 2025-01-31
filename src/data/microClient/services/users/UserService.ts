import { SocialError } from 'core/domain/common/socialError';
import { User } from 'core/domain/users/user';
import { IUserService } from 'core/services/users/IUserService';
import type { IHttpService } from 'core/services/webAPI/IHttpService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { fromJS, Map } from 'immutable';
import { inject, injectable } from 'inversify';

/**
 * Firbase user service
 */
@injectable()
export class UserService implements IUserService {
    @inject(SocialProviderTypes.HttpService) private _httpService: IHttpService;

    constructor() {
        this.getSearchKey = this.getSearchKey.bind(this);
        this.searchUser = this.searchUser.bind(this);
    }

    /**
     * Get user profile
     */
    public getUserProfile = async (userId: string) => {
        try {
            const result = await this._httpService.get(`profile/id/${userId}`);
            return { ...result, userId: result.objectId, creationDate: result.created_date } as User;
        } catch (error: any) {
            throw new SocialError(error.code, `service/getUserProfile :${error.message}`);
        }
    };

    /**
     * Get user profile by social name
     */
    public getProfileBySocialName = async (socialName: string) => {
        try {
            const result = await this._httpService.get(`profile/social/${socialName}`);
            return { ...result, userId: result.objectId, creationDate: result.created_date } as User;
        } catch (error: any) {
            throw new SocialError(error.code, `service/getUserProfile :${error.message}`);
        }
    };

    /**
     * Get current user profile
     */
    public getCurrentUserProfile = async () => {
        try {
            const result = await this._httpService.get('auth/profile/me');

            return { ...result, userId: result.id, creationDate: result.created_date } as User;
        } catch (error: any) {
            throw new SocialError(error.code, `service/getUserProfile :${error.message}`);
        }
    };

    /**
     * Get current user emotion
     */
    public getUserEmotion = async () => {
        try {
            const result = await this._httpService.get('auth/user-emotion');

            return result;
        } catch (error: any) {
            throw new SocialError(error.code, `service/getUserProfile :${error.message}`);
        }
    };

    public setUserEmotion = async (emotion: string) => {
        try {
            const headers = { 'Content-Type': 'application/json' };
            await this._httpService.post('auth/update-emotion', { emotion }, { headers });
        } catch (error: any) {
            throw new SocialError(error.code, `service/getUserProfile :${error.message}`);
        }
    };

    /**
     * Update user profile
     */
    public updateUserProfile = async (userId: string, profile: User) => {
        const updateProfile$ = this._httpService.put('auth/profile', { ...profile });
        await updateProfile$;
    };

    /**
     * Increase share count
     */
    public increaseShareCount = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Decrease share count
     */
    public decreaseShareCount = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Increase follow count
     */
    public increaseFollowCount = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Initialize user status
     */
    initUserStatus = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Decrease follow count
     */
    public decreaseFollowCount = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Search for user profile
     */
    public async searchUser(query: string, filters: string, page: number, limit: number, nin: string[]) {
        try {
            let url = `profile?search=${query}&page=${page + 1}&limit=${limit}`;
            nin.forEach((item) => {
                url += `&nin=${item}`;
            });
            const resultSearch = await this._httpService.get(url);

            const userCount = resultSearch ? resultSearch.length : 0;
            let parsedData: Map<string, any> = Map({});
            let userIds: Map<string, boolean> = Map({});
            if (resultSearch) {
                resultSearch.forEach((user: any) => {
                    if (user.objectId !== filters) {
                        parsedData = parsedData.set(
                            user.objectId,
                            fromJS({ ...user, userId: user.objectId, creationDate: user.created_date }),
                        );
                        userIds = userIds.set(user.objectId, true);
                    }
                });
            }

            return {
                users: parsedData,
                ids: userIds,
                newLastPostId: userCount > 0 ? resultSearch[0].objectId : '',
                hasMore: !(userCount < (limit || 10)),
            };
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    }

    /**
     * Get search key
     */
    public async getSearchKey() {
        return '';
    }

    /**
     * Get users profile
     */
    public getUsersProfile = () => {
        return 'Not implemented' as any;
    };
}
