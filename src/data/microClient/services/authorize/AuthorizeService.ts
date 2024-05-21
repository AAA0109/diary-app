import { OAuthType } from 'core/domain/authorize/oauthType';
import { IAuthorizeService } from 'core/services/authorize/IAuthorizeService';
import { inject, injectable } from 'inversify';
import type { IHttpService } from 'core/services/webAPI/IHttpService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { AuthAPI } from 'api/AuthAPI';
import jwtDecode from 'jwt-decode';
import { log } from 'utils/log';
import { SocialError } from 'core/domain/common/socialError';
import config from 'config/index';
import { UserRegisterModel } from 'models/users/userRegisterModel';

/**
 * Authorize service
 */
@injectable()
export class AuthorizeService implements IAuthorizeService {
    @inject(SocialProviderTypes.HttpService) private _httpService: IHttpService;
    // eslint-disable-next-line
    constructor() { }

    /**
     * Login the user
     */
    public login = async (email: string, password: string) => {
        try {
            const form = {
                "email": email,
                "password": password,
            }

            const headers = { 'Content-Type': 'application/json' };
            const result = await this._httpService.postWithoutAuth('auth/login', form, { headers });
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public googleLogin = async (token: string) => {
        try {
            const headers = { 'Content-Type': 'application/json' };
            const result = await this._httpService.postWithoutAuth('auth/google-login', { authToken: token }, { headers });
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public checkGuardian = async (firstName: string, lastName: string, email: string) => {
        try {
            const form = {
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
            }

            const headers = { 'Content-Type': 'application/json' };
            const result = await this._httpService.postWithoutAuth('auth/check-guardian', form, { headers });
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    /**
     * Whether user is loged in or not
     */
    public isLoggedin = () => {
        return this.getUserAuthCookie() !== null;
    };

    /**
     * Get user auth cookie
     */
    public getUserAuthCookie = () => {
        const payload = AuthAPI.readCookie('pa');
        return {
            payload,
        };
    };

    /**
     * Get user auth
     */
    public getUserAuth = () => {
        const token = this.getAccessToken();
        if (token) {
            const decodedToken = jwtDecode(token);

            if (this.isJwtExpired(decodedToken)) {
                log.error('[Authrize Service] Token is expired ', decodedToken);
                return null;
            }

            return decodedToken;
        }
        return null;
    };

    /**
     * Get access token
     */
    public getAccessToken = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            throw new Error('Access token is undefined!');
        }
        return accessToken;
    };

    /**
     * Get user from token
     */
    public getUserFromToken = (token: string) => {
        return jwtDecode(token);
    };

    /**
     *
     * @param decodedToken Decoded JWT token
     * @returns Is token expired
     */
    public isJwtExpired = (decodedToken: any) => {
        let isJwtExpired = false;
        const { exp } = decodedToken;
        const currentTime = new Date().getTime() / 1000;

        if (currentTime > exp) isJwtExpired = true;

        return isJwtExpired;
    };

    /**
     * Login user by token
     */
    public async loginByToken() {
        return ' Not implemented!' as any;
    }

    /**
     * Logs out the user
     */
    public logout = () => {
        AuthAPI.eraseCookie('he');
        AuthAPI.eraseCookie('pa');
        AuthAPI.eraseCookie('si');
    };

    /**
     * Register a user
     */
    public getUserRegisterToken = async (user: any) => {
        try {
            const headers = { 'Content-Type': 'application/json' };
            const result = await this._httpService.postWithoutAuth('auth/signup', user, { headers });
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public updateProfile = async (body: any) => {
        try {
            const res = await this._httpService.put('auth/profile', body);
            return { res };
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    /**
     * Verify user register code
     */
    public verifyUserRegisterCode = async (code: string, registerToken: string) => {
        try {
            const form = new FormData();
            form.append('code', code);
            form.append('verificaitonSecret', registerToken);
            form.append('responseType', 'spa');

            const headers = { 'Content-Type': 'multipart/form-data' };
            const result = await this._httpService.post('auth/signup/verify', form, { headers });
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    /**
     * Change password
     */
    public changePassword = async (newPassword: string, token: string) => {
        try {
            const form = {
                "password": newPassword,
                "token": token,
            }

            const headers = { 'Content-Type': 'application/json' };
            const result = await this._httpService.postWithoutAuth('auth/change-password', form, { headers });
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    /**
     * Update password
     */
    public updatePassword = async (currentPassword: string, newPassword: string) => {
        try {
            const form = {
                "currentPassword": currentPassword,
                "newPassword": newPassword,
            }

            const headers = { 'Content-Type': 'application/json' };
            const result = await this._httpService.post('auth/update-password', form, { headers });
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    /**
     * Verify password token
     */
    public verifyPasswordToken = async (token: string) => {
        try {
            const form = {
                "token": token,
            }

            const headers = { 'Content-Type': 'application/json' };
            const result = await this._httpService.postWithoutAuth('auth/verify-password-token', form, { headers });
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    /**
     * Register a user
     */
    public registerUser = async () => {
        return ' Not implemented!' as any;
    };

    /**
     * Whether user is login or not
     */
    public isUserUserVerified() {
        return ' Not implemented!' as any;
    }

    /**
     * Get id token
     */
    public getUserClaim = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Reset user password
     */
    public resetPassword = async (email: string) => {
        try {
            const form = {
                "email": email,
            }

            const headers = { 'Content-Type': 'application/json' };
            const result = await this._httpService.postWithoutAuth('auth/reset-password', form, { headers });
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    /**
     * Send verfication email to user email
     */
    public sendEmailVerification = async () => {
        return ' Not implemented!' as any;
    };

    public loginWithOAuth: (type: OAuthType) => Promise<any> = () => {
        const resource = `${window.location.href}`;
        window.location.href = `${config.gateway.github_oauth_url}?r=${resource}`;
        return Promise.resolve(null);
    };

    public createFamily = async (id: string, familyName: string, description: string) => {
        try {
            const form = {
                "id": id,
                "name": familyName,
                "description": description,
            }

            const headers = { 'Content-Type': 'application/json' };
            const result = await this._httpService.post('family/create', form, { headers });
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public findFamily = async (name: string) => {
        try {
            const form = {
                "name": name,
            }

            const headers = { 'Content-Type': 'application/json' };
            const result = await this._httpService.post('family/find', form, { headers });
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public enterFamily = async (id: string, user_id: string) => {
        try {
            const form = {
                "user_id": user_id,
                "family_id": id,
            }
            const headers = { 'Content-Type': 'application/json' };
            const result = await this._httpService.post('family/enter', form, { headers });
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public updateFamily = async (form: any) => {
        try {
            const headers = { 'Content-Type': 'application/json' };
            const result = await this._httpService.post('family/update', form, { headers });
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public getMembers = async () => {
        try {
            const result = await this._httpService.get('family/members');
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public findMember = async (email: string) => {
        try {
            const form = {
                email,
            }
            const result = await this._httpService.post('family/member');
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public getFamilyMotos = async () => {
        try {
            const result = await this._httpService.get('family/motos');
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public getCurrentFamilyMoto = async () => {
        try {
            const result = await this._httpService.get('family/current_moto');
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public createFamilyMoto = async (motiveHeading: string, motiveDescription: string) => {
        try {
            const result = await this._httpService.post('family/moto/create', {
                name: motiveHeading,
                description: motiveDescription,
            });
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public editFamilyMoto = async (motoId: string, motiveHeading: string, motiveDescription: string) => {
        try {
            const result = await this._httpService.post(`family/moto/${motoId}/update`, {
                name: motiveHeading,
                description: motiveDescription,
            });
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public archieveFamilyMoto = async (motoId: string) => {
        try {
            const result = await this._httpService.post(`family/moto/${motoId}/archive`);
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public deleteFamilyMoto = async (motoId: string) => {
        try {
            const result = await this._httpService.delete(`family/moto/${motoId}/remove`);
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    public addFamilyMotoComment = async (motoId: string, comment: string, parentId?: string) => {
        try {
            const params = {
                comment,
                parentId,
            }
            const result = await this._httpService.post(`family/moto/${motoId}/comment`, params);
            return { error: result.error };
        } catch (error: any) {
            console.log(error);
            throw new SocialError(error.code, error.message);
        }
    };

    public deleteFamilyMotoComment = async (commentId: string) => {
        try {
            const result = await this._httpService.delete(`family/moto/comment/${commentId}`);
            return { error: result.error };
        } catch (error: any) {
            console.log(error);
            throw new SocialError(error.code, error.message);
        }
    };

    public sendInvitation = async (email: string, link: string) => {
        try {
            const payload = {
                email,
                link,
            }
            const result = await this._httpService.post(`user/send-invitation`, payload);
            return result;
        } catch (error: any) {
            throw new SocialError(error.code, error.message);
        }
    };

    /**
     * Send sms verfication
     */
    public sendSmsVerification = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Send email verfication
     */
    public sendResetPasswordVerification = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Confirm phone code verfication
     */
    public confirmVerificationPhone = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Confirm email code verfication
     */
    public confirmVerificationEmail = async () => {
        return ' Not implemented!' as any;
    };

    /**
     * Confirm reset password code
     */
    public confirmResetPassword = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Store user information
     */
    private storeUserInformation = () => {
        return ' Not implemented!' as any;
    };

    /**
     * Store user provider information
     */
    private storeUserProviderData = () => {
        return ' Not implemented!' as any;
    };
}
