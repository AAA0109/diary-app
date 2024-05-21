import React, { createContext, useEffect, useReducer } from 'react';
import { Map } from 'immutable';
// utils

import { provider } from 'socialEngine';
import { IAuthorizeService } from 'core/services/authorize/IAuthorizeService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { IUserService } from 'core/services/users/IUserService';
import * as userActions from 'redux/actions/userActions';
import * as globalActions from 'redux/actions/globalActions';
import * as authorizeActions from 'redux/actions/authorizeActions';
import { UserModel } from 'models/users/UserModel';
import { useDispatch } from 'redux/store';
import JwtDecode from 'jwt-decode';
import { OAuthType } from 'core/domain/authorize/oauthType';
import { UserClaim } from 'core/domain/authorize/userClaim';
import { RegisterStepEnum } from 'models/authorize/signupStepEnum';
import { isValidToken, setSession } from '../utils/jwt';
// ----------------------------------------------------------------------

const authorizeService: IAuthorizeService = provider.get<IAuthorizeService>(SocialProviderTypes.AuthorizeService);
const userService: IUserService = provider.get<IUserService>(SocialProviderTypes.UserService);

const initialState: {
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: UserModel | null;
} = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
};

const handlers = {
    INITIALIZE: (state: Record<string, any>, action: Record<string, any>) => {
        const { isAuthenticated, user } = action.payload;
        return {
            ...state,
            isAuthenticated,
            isInitialized: true,
            user,
        };
    },
    LOGIN: (state: Record<string, any>, action: Record<string, any>) => {
        const { user } = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
        };
    },
    LOGOUT: (state: Record<string, any>) => ({
        ...state,
        isAuthenticated: false,
        user: null,
    }),
    REGISTER: (state: Record<string, any>, action: Record<string, any>) => {
        const { user } = action.payload;
        return {
            ...state,
            isAuthenticated: true,
            user,
        };
    },
    UPDATE_PROFILE: (state: Record<string, any>, action: Record<string, any>) => {
        const { user } = action.payload;
        console.log({ ...state.user, });
        return {
            ...state,
            user: { ...state.user, ...user }
        };
    },
};

const reducer = (state: Record<string, any>, action: Record<string, any>) =>
    handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
    ...initialState,
    method: 'telar',
    login: (email: string, password: string) => Promise.resolve(),
    googleLogin: (token: string) => Promise.resolve(),
    verifyRegisterCode: (code: string) => Promise.resolve(),
    fetchRegisterToken: (
        email: string,
        password: string,
        username: string,
    ) => Promise.resolve({ error: {}, user: {} }),
    savePrimaryInformation: (
        firstName: string,
        lastName: string,
        birthdate: string,
        nextStep: number,
        // recaptchVerifier: string,
    ) => Promise.resolve(),
    saveGuardianInformation: (
        guardianFirstName: string,
        guardianLastName: string,
        guardianEmail: string,
        allowParental: boolean,
        // recaptchVerifier: string,
    ) => Promise.resolve({ error: '', guardianId: null, family: null }),
    saveInvitationInformation: (guardianId: string, family_id: string) => Promise.resolve(),
    loginWithGithub: () => Promise.resolve(),
    loginWithGoogle: () => Promise.resolve(),
    loginWithFaceBook: () => Promise.resolve(),
    loginWithTwitter: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    resetPassword: (email: string) => Promise.resolve({ error: '', success: true }),
    changePassword: (newPassword: string, token: string) => Promise.resolve({ error: '', success: true }),
    updatePassword: (currentPassword: string, newPassword: string) => Promise.resolve({ error: '', success: true }),
    verifyPasswordToken: (token: string) => Promise.resolve({ error: '', success: true }),
    updateProfile: (model: any) => Promise.resolve(),
    updateSocialInfo: (model: userActions.UpdateProfileSocialPayload) => Promise.resolve(),
    createFamily: (id: string, name: string, description: string) => Promise.resolve({ errors: [] }),
    findFamily: (name: string) => Promise.resolve({ familyList: [] }),
    enterFamily: (id: string, user_id: string) => Promise.resolve({ error: '' }),
    updateFamily: (id: string, name: string, description: string) => Promise.resolve({ error: '' }),
    getMembers: () => Promise.resolve({ members: [] }),
    findMember: () => Promise.resolve({ members: [] }),
    getFamilyMotos: () => Promise.resolve({ motos: [] }),
    getCurrentFamilyMoto: () => Promise.resolve({ currentMoto: null }),
    createFamilyMoto: (motiveHeading: string, motiveDescription: string) => Promise.resolve({ newMoto: null }),
    editFamilyMoto: (motoId: string, motiveHeading: string, motiveDescription: string) => Promise.resolve({ moto: null }),
    addFamilyMotoComment: (motoId: string, comment: string, parentId?: string) => Promise.resolve({ error: '' }),
    deleteFamilyMotoComment: (commentId: string) => Promise.resolve({ error: '' }),
    archieveFamilyMoto: (motoId: string) => Promise.resolve({ error: '' }),
    deleteFamilyMoto: (motoId: string) => Promise.resolve({ error: '' }),
    sendInvitation: (email: string, link: string) => Promise.resolve({}),
    currentRegisterStep: () => Number,
    startSharing: () => Promise.resolve(),
});

export interface AuthProviderProps {
    children: React.ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const dispatchStore = useDispatch();
    const initializeUser = async (claim: UserClaim, user: Record<string, any>) => {
        dispatchStore(authorizeActions.asyncSetUserLogin(claim));
        dispatchStore(userActions.addUserInfo(user.objectId, Map({ ...user, userId: user.objectId })));
        await dispatchStore(globalActions.loadInitialData());
        dispatch({
            type: 'INITIALIZE',
            payload: {
                isAuthenticated: true,
                user,
            },
        });
        await initializeUserEmotion();
    };

    const initializeUserEmotion = async () => {
        const { emotion } = await userService.getUserEmotion();
        dispatchStore(globalActions.setEmotion(emotion));
    }

    const initializeAuth = async () => {
        try {
            const accessToken = authorizeService.getAccessToken();
            if (accessToken && isValidToken(accessToken)) {
                setSession(accessToken);
                const userAuth: any = JwtDecode(accessToken);
                const { fullName, email } = userAuth;
                const user = await userService.getCurrentUserProfile();
                user.email = email;
                user.id = user.userId;
                user.about = user.tagLine;
                user.phoneNumber = user.phone;
                user.role = user.role.role;

                await initializeUser(userAuth.claim, user);
            } else {
                dispatch({
                    type: 'INITIALIZE',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                });
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('[Context] Authenticated ', err);
            dispatch({
                type: 'INITIALIZE',
                payload: {
                    isAuthenticated: false,
                    user: null,
                },
            });
        }
    };
    useEffect(() => {
        initializeAuth();
    }, []);

    const loginWithGithub = () => {
        return dispatchStore<any>(authorizeActions.dbLoginWithOAuth(OAuthType.GITHUB));
    };

    const login = async (email: string, password: string) => {
        const { user, message, accessToken, status } = await authorizeService.login(email, password);
        if (status === 401) {
            throw new DOMException(message);
        }
        const mappedUser = {
            ...user,
            id: user.id,
            email: user.email,
            about: "",
            role: user?.role?.role,
        };
        setSession(accessToken);
        await initializeUser(
            {
                uid: user.id.toString(),
                emailVerified: user.emailVerified,
                providerId: 'telar',
                fullName: mappedUser.fullName,
                email: user.email,
                avatar: user.avatar,
                phoneVerified: true,
                family: user.family,
                birthdate: user.birthdate,
            },
            mappedUser,
        );

        dispatch({
            type: 'LOGIN',
            payload: {
                user: mappedUser,
            },
        });

        await initializeUserEmotion();
    };

    const googleLogin = async (token: string) => {
        const { user, message, accessToken, status } = await authorizeService.googleLogin(token);
        if (status === 401) {
            throw new DOMException(message);
        }
        const mappedUser = {
            ...user,
            id: user.id,
            email: user.email,
            about: "",
            role: user?.role?.role,
        };
        setSession(accessToken);
        await initializeUser(
            {
                uid: user.id.toString(),
                emailVerified: user.emailVerified,
                providerId: 'telar',
                fullName: mappedUser.fullName,
                email: user.email,
                avatar: user.avatar,
                phoneVerified: true,
                birthdate: user.birthdate,
            },
            mappedUser,
        );

        dispatch({
            type: 'LOGIN',
            payload: {
                user: mappedUser,
            },
        });
    };

    const fetchRegisterToken = async (
        email: string,
        password: string,
        username: string,
    ) => {
        const { firstName, lastName, birthdate, guardianId, allowParental, family_id, familyName } = JSON.parse(localStorage.getItem('register') ?? '{}');
        const res = await authorizeService.getUserRegisterToken({
            firstName,
            lastName,
            birthdate,
            guardianId,
            allowParental,
            email,
            password,
            username,
            family_id,
            familyName,
        });
        return res;
    };

    const saveInvitationInformation = (
        guardianId: string,
        family_id: string,
    ) => {
        const register = localStorage.getItem('register');
        localStorage.setItem('register', JSON.stringify({ ...JSON.parse(register ?? '{}'), guardianId, family_id }));
    };

    const savePrimaryInformation = async (
        firstName: string,
        lastName: string,
        birthdate: string,
        nextStep: number,
    ) => {
        const register = localStorage.getItem('register');
        localStorage.setItem('register', JSON.stringify({ ...JSON.parse(register ?? '{}'), firstName, lastName, birthdate, step: nextStep }));
    };

    const saveGuardianInformation = async (
        guardianFirstName: string,
        guardianLastName: string,
        guardianEmail: string,
        allowParental: boolean,
    ) => {
        const { error, guardianId, family } = await authorizeService.checkGuardian(guardianFirstName, guardianLastName, guardianEmail);
        if (error) {
            return { error };
        }
        const register = localStorage.getItem('register');
        if (register) {
            localStorage.setItem('register', JSON.stringify({ ...JSON.parse(register), guardianId, allowParental, family_id: family?.id, step: RegisterStepEnum.AccountInformation }));
        }
        return { guardianId, family };
    };

    const currentRegisterStep = () => {
        const register = localStorage.getItem('register');
        if (register) {
            const { step } = JSON.parse(register);
            return step ?? RegisterStepEnum.PrimaryInformation;
        }
        return RegisterStepEnum.PrimaryInformation;
    }

    const verifyRegisterCode = (code: string) => {
        return dispatchStore(authorizeActions.asyncVerifyUserRegisterCode(code));
    };

    const logout = async () => {
        dispatchStore(authorizeActions.asyncLogout());
        setSession(null);
        dispatch({ type: 'LOGOUT' });
        window.location.href = '/';
    };

    const resetPassword = async (email: string) => {
        const res = await authorizeService.resetPassword(email);
        return res;
    };

    const changePassword = async (newPassword: string, token: string) => {
        const res = await authorizeService.changePassword(newPassword, token);
        return res;
    };

    const updatePassword = async (currentPassword: string, newPassword: string) => {
        const res = await authorizeService.updatePassword(currentPassword, newPassword);
        return res;
    };

    const verifyPasswordToken = async (token: string) => {
        const res = await authorizeService.verifyPasswordToken(token);
        return res;
    };

    const startSharing = async () => {
        await authorizeService.updateProfile({ onboarding: false });
        dispatch({
            type: 'UPDATE_PROFILE',
            payload: {
                user: { onboarding: false, },
            },
        });
    };

    const updateProfile = async (profile: any) => {
        const { res } = await authorizeService.updateProfile(profile);
        console.log(res);
        dispatch({
            type: 'UPDATE_PROFILE',
            payload: {
                user: { ...res, },
            },
        });
    };

    const createFamily = async (id: string, name: string, description: string) => {
        const { user, errors } = await authorizeService.createFamily(id, name, description);
        if (!errors?.length) {
            dispatch({
                type: 'UPDATE_PROFILE',
                payload: {
                    user,
                },
            });
        }
        return { errors };
    }

    const findFamily = async (name: string) => {
        const { familyList } = await authorizeService.findFamily(name);
        return { familyList };
    }

    const enterFamily = async (id: string, user_id: string) => {
        const { error, user } = await authorizeService.enterFamily(id, user_id);
        if (!error?.length) {
            dispatch({
                type: 'UPDATE_PROFILE',
                payload: {
                    user,
                },
            });
        }
        return { error };
    }

    const updateFamily = async (id: string, name: string, description: string) => {
        const { user, error } = await authorizeService.updateFamily({
            id, name, description,
        });
        if (!error) {
            dispatch({
                type: 'UPDATE_PROFILE',
                payload: {
                    user,
                },
            });
        }
        return { error };
    }

    const getMembers = async () => {
        const { members } = await authorizeService.getMembers();
        return { members };
    };

    const findMember = async (email: string) => {
        const { members } = await authorizeService.findMember(email);
        return { members };
    }

    const getFamilyMotos = async () => {
        const { motos } = await authorizeService.getFamilyMotos();
        return { motos };
    }

    const getCurrentFamilyMoto = async () => {
        const { currentMoto } = await authorizeService.getCurrentFamilyMoto();
        return { currentMoto };
    }

    const createFamilyMoto = async (motiveHeading: string, motiveDescription: string) => {
        const { newMoto } = await authorizeService.createFamilyMoto(motiveHeading, motiveDescription);
        return { newMoto };
    }

    const editFamilyMoto = async (motoId: string, motiveHeading: string, motiveDescription: string) => {
        const { newMoto } = await authorizeService.editFamilyMoto(motoId, motiveHeading, motiveDescription);
        return { moto: newMoto };
    }

    const addFamilyMotoComment = async (motoId: string, comment: string, parentId?: string) => {
        const { error } = await authorizeService.addFamilyMotoComment(motoId, comment, parentId);
        return { error };
    }

    const deleteFamilyMotoComment = async (commentId: string) => {
        const { error } = await authorizeService.deleteFamilyMotoComment(commentId);
        return { error };
    }

    const archieveFamilyMoto = async (motoId: string) => {
        const { error } = await authorizeService.archieveFamilyMoto(motoId);
        return { error };
    }

    const deleteFamilyMoto = async (motoId: string) => {
        const { error } = await authorizeService.deleteFamilyMoto(motoId);
        return { error };
    }

    const sendInvitation = async (email: string, link: string) => {
        const res = await authorizeService.sendInvitation(email, link);
        return res;
    }

    const updateSocialInfo = async (info: userActions.UpdateProfileSocialPayload) =>
        dispatchStore(userActions.updateProfileSocial(info));

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'telar',
                loginWithGithub,
                login,
                googleLogin,
                logout,
                fetchRegisterToken,
                savePrimaryInformation,
                saveGuardianInformation,
                currentRegisterStep,
                verifyRegisterCode,
                changePassword,
                updatePassword,
                verifyPasswordToken,
                resetPassword,
                updateProfile,
                updateSocialInfo,
                createFamily,
                findFamily,
                enterFamily,
                updateFamily,
                getMembers,
                findMember,
                startSharing,
                getFamilyMotos,
                getCurrentFamilyMoto,
                createFamilyMoto,
                addFamilyMotoComment,
                deleteFamilyMotoComment,
                editFamilyMoto,
                archieveFamilyMoto,
                deleteFamilyMoto,
                sendInvitation,
                saveInvitationInformation,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };
