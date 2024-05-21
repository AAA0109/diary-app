import { UserClaim } from 'core/domain/authorize/userClaim';
import { UserRegisterModel } from 'models/users';
import { LoginUser } from 'core/domain/authorize/loginUser';
import { OAuthType } from 'core/domain/authorize/oauthType';
import { RegisterUserResult } from 'core/domain/authorize/registerUserResult';
import { Family } from 'core/domain/family/family';
import { DBUser } from 'core/domain/users/dbUser';
import { FamilyMoto } from 'core/domain/family/familyMoto';

/**
 * Authentication service interface
 */
export interface IAuthorizeService {
    /**
     * Login the user
     */
    findMember: (email: string) => Promise<{ members: DBUser[] }>;

    getMembers: () => Promise<{ members: DBUser[] }>;

    updateProfile: (body: any) => Promise<{ res: any }>;

    updateFamily: (body: any) => Promise<{ user: LoginUser; error?: string }>;

    enterFamily: (id: string, user_id: string) => Promise<{ user: LoginUser; error?: string }>;

    createFamily: (id: string, name: string, description: string) => Promise<{ user: LoginUser; errors?: string[] }>;

    findFamily: (name: string) => Promise<{ familyList?: Family[] }>;

    login: (email: string, password: string) => Promise<{ user: LoginUser; message: string; accessToken: string; status: number }>;

    checkGuardian: (firstName: string, lastName: string, email: string) => Promise<{ error?: string; guardianId?: number, family?: Family }>;

    googleLogin: (token: string) => Promise<{ user: LoginUser; message: string; accessToken: string; status: number }>;

    /**
     * Whether user is loged in or not
     */
    isLoggedin: () => boolean;

    /**
     * Get user auth
     */
    getUserAuth: () => any;

    /**
     * Get access token
     */
    getAccessToken: () => string | null;

    /**
     * Login by token
     */
    loginByToken: (token: string) => Promise<LoginUser | null>;

    /**
     * Logs out the user
     */
    logout: () => void;

    /**
     * Whether user is login or not
     */
    isUserUserVerified: () => boolean;

    /**
     * Get user claim
     */
    getUserClaim: () => Promise<UserClaim>;

    /**
     * Update user password
     */
    updatePassword: (currentPassword: string, newPassword: string) => Promise<{ success?: boolean; error?: any; }>;

    /**
     * Get register user token
     */
    getUserRegisterToken: (user: any) => Promise<{ user?: LoginUser; error?: any; }>;

    /**
     * Verify user register code
     */
    verifyUserRegisterCode: (code: string, registerToken: string) => Promise<string>;

    /**
     * Change password
     */
    changePassword: (newPassword: string, token: string) => Promise<{ success?: boolean; error?: any; }>;

    verifyPasswordToken: (token: string) => Promise<{ user?: LoginUser; error?: any; }>;

    /**
     * Register new user
     */
    registerUser: (user: UserRegisterModel) => Promise<RegisterUserResult>;

    /**
     * Reset user password
     */
    resetPassword: (email: string) => Promise<{ success: boolean; error?: string; }>;

    /**
     * Send email verification
     */
    sendEmailVerification: (value: any) => Promise<string>;

    /**
     * Login user by OAuth authentication
     */
    loginWithOAuth: (type: OAuthType) => Promise<LoginUser>;

    /**
     * Send sms verfication
     */
    sendSmsVerification: (phoneNumber: string, value: any) => Promise<string>;

    /**
     * Send sms verfication
     */
    sendResetPasswordVerification: (email: string, value: any) => Promise<string>;

    /**
     * Confirm verfication phone
     */
    confirmVerificationPhone: (code: string, verifyId: string, phoneNumber: string) => Promise<any>;

    /**
     * Confirm verfication email
     */
    confirmVerificationEmail: (code: string, verifyId: string) => Promise<any>;

    /**
     * Confirm verfication code
     */
    confirmResetPassword: (code: string, verifyId: string, email: string) => Promise<any>;

    getFamilyMotos: () => Promise<{ motos: FamilyMoto[] }>;

    getCurrentFamilyMoto: () => Promise<{ currentMoto: FamilyMoto }>;

    createFamilyMoto: (motiveHeading: string, motiveDescription: string) => Promise<{ newMoto: FamilyMoto }>;

    editFamilyMoto: (motoId: string, motiveHeading: string, motiveDescription: string) => Promise<{ newMoto: FamilyMoto }>;

    addFamilyMotoComment: (motoId: string, comment: string, parentId?: string) => Promise<{ error: '' }>;

    deleteFamilyMotoComment: (commentId: string) => Promise<{ error: '' }>;

    archieveFamilyMoto: (motoId: string) => Promise<{ error: '' }>;

    deleteFamilyMoto: (motoId: string) => Promise<{ error: '' }>;

    sendInvitation: (email: string, link: string) => Promise<{}>;
}
