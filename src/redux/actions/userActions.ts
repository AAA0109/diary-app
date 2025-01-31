import { UserActionType } from 'constants/userActionType';
import { Map } from 'immutable';
import { SocialError } from 'core/domain/common/socialError';
import { User } from 'core/domain/users/user';
import { IUserService } from 'core/services/users/IUserService';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import * as globalActions from 'redux/actions/globalActions';
import { createPromiseAction } from '@adobe/redux-saga-promise';
import { provider } from '../../socialEngine';
import { userGetters } from '../reducers/users/userGetters';

// ----------------------------------------------------------------------

export type UpdateUserProfilePayload = {
    fullName?: string;
    onboarding?: boolean;
    avatar?: string;
    phoneNumber?: string;
    country?: string;
    address?: string;
    about?: string;
    isPublic?: string;
    customName?: string;
};

export type UpdateProfileSocialPayload = {
    facebookLink: string;
    instagramLink: string;
    linkedinLink: string;
    twitterLink: string;
};

export type CreateFamilyPayload = {
    id: string;
    name: string;
    description: string;
};

// ----------------------------------------------------------------------

/**
 * Get service providers
 */
const userService: IUserService = provider.get<IUserService>(SocialProviderTypes.UserService);

/* _____________ CRUD DB _____________ */

/**
 * Get user info from database
 */
export const dbGetUserInfo = () => {
    return {
        type: UserActionType.DB_FETCH_USER_PROFILE,
    };
};

/**
 *  Get user info from database
 */
export const fetchProfileById: (uid: string) => any = createPromiseAction(
    UserActionType.USER_FETCH_PROFILE_BY_ID,
    (uid: string) => ({ uid }),
);

/**
 *  Get user info from database
 */
export const getUserProfilePage = (uid: string) => {
    return {
        type: UserActionType.GET_USER_PROFILE_PAGE,
        payload: { uid },
    };
};

/**
 * Updata user information
 */
export const dbUpdateUserInfo = (newProfile: User) => {
    return (dispatch: any, getState: Function) => {
        const state: Map<string, any> = getState();
        const uid = state.getIn(['authorize', 'uid']) as string;

        let profile: Map<string, any> = userGetters.getUserProfileById(state, { userId: uid });

        if (newProfile.avatar) {
            profile = profile.set('avatar', newProfile.avatar);
        }

        if (newProfile.banner) {
            profile = profile.set('banner', newProfile.banner);
        }

        if (newProfile.email) {
            profile = profile.set('email', newProfile.email);
        }

        if (newProfile.fullName) {
            profile = profile.set('fullName', newProfile.fullName);
        }

        if (newProfile.tagLine) {
            profile = profile.set('tagLine', newProfile.tagLine);
        }

        if (newProfile.birthday) {
            profile = profile.set('birthday', newProfile.birthday);
        }

        if (newProfile.companyName) {
            profile = profile.set('companyName', newProfile.companyName);
        }

        if (newProfile.webUrl) {
            profile = profile.set('webUrl', newProfile.webUrl);
        }

        if (newProfile.twitterId) {
            profile = profile.set('twitterId', newProfile.twitterId);
        } else {
            profile = profile.set('twitterId', '');
        }

        if (newProfile.facebookId) {
            profile = profile.set('facebookId', newProfile.facebookId);
        } else {
            profile = profile.set('facebookId', '');
        }

        if (newProfile.creationDate) {
            profile = profile.set('creationDate', newProfile.creationDate);
        }

        if (newProfile.permission) {
            profile = profile.set('permission', newProfile.permission);
        }

        if (newProfile.accessUserList) {
            profile = profile.set('accessUserList', newProfile.accessUserList);
        }
        dispatch(globalActions.showTopLoading());

        return userService
            .updateUserProfile(uid, profile.toJS() as User)
            .then(() => {
                dispatch(globalActions.hideTopLoading());

                dispatch(updateUserInfo(uid, profile));
                dispatch(closeEditProfile());
            })
            .catch((error: SocialError) => {
                dispatch(globalActions.hideTopLoading());
                dispatch(globalActions.showMessage(error.message));
            });
    };
};

/* _____________ CRUD State _____________ */

/**
 * Add user information
 */
export const addUserInfo = (uid: string, info: Map<string, any>) => {
    return {
        type: UserActionType.ADD_USER_INFO,
        payload: { uid, info },
    };
};

/**
 * Update user profile
 */
export const updateUserProfile: (user_id: String, profile: UpdateUserProfilePayload) => any = createPromiseAction(
    UserActionType.USER_UPDATE_PROFILE,
    (profile: UpdateUserProfilePayload) => profile,
);

export const createFamily: (family: CreateFamilyPayload) => any = createPromiseAction(
    UserActionType.CREATE_FAMILY,
    (family: CreateFamilyPayload) => family,
);

/**
 * Update user profile social info
 */
export const updateProfileSocial: (profile: UpdateProfileSocialPayload) => any = createPromiseAction(
    UserActionType.USER_UPDATE_PROFILE_SOCIAL,
    (profile: UpdateProfileSocialPayload) => profile,
);

/**
 *  Fetch profile by social name
 */
export const fetchProfileBySocialName: (socialName: string) => any = createPromiseAction(
    UserActionType.USER_FETCH_PROFILE_BY_SOCIAL_NAME,
    (socialName: string) => ({
        socialName,
    }),
);

/**
 * Add plain user information
 */
export const addPlainUserInfo = (uid: string, info: User) => {
    return {
        type: UserActionType.ADD_PLAIN_USER_INFO,
        payload: { uid, info },
    };
};

/**
 * Fetch user list from server
 */
export const dbFetchFindPeople = (page = 0, limit = 10) => {
    return {
        type: UserActionType.DB_FETCH_FIND_PEOPLE,
        payload: { page, limit },
    };
};

/**
 * Fetch user list from server
 */
export const fetchUserSearch: (query: string, page: number, limit: number) => any = createPromiseAction(
    UserActionType.DB_FETCH_USER_SEARCH,
    (query = '', page = 0, limit = 10) => ({
        query,
        page,
        limit,
    }),
);

/**
 * Reset search user
 */
export const resetSearchUser = () => {
    return {
        type: UserActionType.USER_RESET_SEARCH,
    };
};

/**
 * Fetch user suggestions from server
 */
export const fetchUserSuggestions = () => {
    return {
        type: UserActionType.DB_FETCH_USER_SUGGESTIONS,
        payload: {},
    };
};

/**
 * Add people information
 */
export const addFindPeople = (userIds: Map<string, boolean>) => {
    return {
        type: UserActionType.ADD_FIND_PEOPLE,
        payload: { userIds },
    };
};

/**
 * Add user suggestions
 */
export const addUserSuggestions = (userIds: Map<string, boolean>, overwrite: boolean) => {
    return {
        type: UserActionType.ADD_USER_SUGGESTIONS,
        payload: { userIds },
        meta: {
            overwrite,
        },
    };
};

/**
 * Set post search key
 */
export const setPostSearchKey = (searchKey: string) => {
    return {
        type: UserActionType.SET_USER_SEARCH_KEY,
        payload: { searchKey },
    };
};

/**
 * Add people information
 */
export const addUserSearch = (userIds: Map<string, boolean>, overwrite: boolean) => {
    return {
        type: UserActionType.ADD_USER_SEARCH,
        payload: { userIds },
        meta: {
            overwrite,
        },
    };
};

/**
 * Add people information
 */
export const addPeopleInfo = (infoList: Map<string, Map<string, any>>) => {
    return {
        type: UserActionType.ADD_PEOPLE_INFO,
        payload: infoList,
    };
};

/**
 * Update user information
 */
export const updateUserInfo = (uid: string, info: Map<string, any>) => {
    return {
        type: UserActionType.UPDATE_USER_INFO,
        payload: { uid, info },
    };
};

export const clearAllData = () => {
    return {
        type: UserActionType.CLEAR_ALL_DATA_USER,
    };
};

/**
 * Open edit profile
 */
export const openEditProfile = () => {
    return {
        type: UserActionType.OPEN_EDIT_PROFILE,
    };
};

/**
 * Close edit profile
 */
export const closeEditProfile = () => {
    return {
        type: UserActionType.CLOSE_EDIT_PROFILE,
    };
};

/**
 * Add a list of post for profile users
 */
export const addProfilePosts = (userId: string, postIds: Map<string, boolean>) => {
    return {
        type: UserActionType.ADD_PROFILE_LIST_POST,
        payload: { postIds, userId },
    };
};

/**
 * Add a list of post for profile users
 */
export const addProfileAlbums = (userId: string, postIds: Map<string, boolean>) => {
    return {
        type: UserActionType.ADD_PROFILE_LIST_ALBUM,
        payload: { postIds, userId },
    };
};

/**
 * Set profile posts has more data to show
 */
export const hasMoreFindPeople = () => {
    return {
        type: UserActionType.HAS_MORE_FIND_PEOPLE,
    };
};

/**
 * No more users for find people
 */
export const notMoreFindPeople = () => {
    return {
        type: UserActionType.NOT_MORE_FIND_PEOPLE,
    };
};

/**
 * Set profile posts has more data to show
 */
export const hasMoreSearchPeople = () => {
    return {
        type: UserActionType.HAS_MORE_PEOPLE_SEARCH,
    };
};

/**
 * No more users for find people
 */
export const notMoreSearchPeople = () => {
    return {
        type: UserActionType.NOT_MORE_PEOPLE_SEARCH,
    };
};

/**
 * Set last page request of profile posts
 */
export const setFindPagePeoplePage = (page: number) => {
    return {
        type: UserActionType.SET_FIND_PEOPLE_PAGE,
        payload: { page },
    };
};

/**
 * Set profile alvum posts has more data to show
 */
export const fetchAlbums = (userId: string, page: number, limit = 10) => {
    return {
        type: UserActionType.DB_GET_ALBUM_POST_BY_USER_ID,
        payload: { userId, page, limit },
    };
};

/**
 * Increase album page count of album
 */
export const increasePageAlbum = (userId: string) => {
    return {
        type: UserActionType.INCREASE_PAGE_ALBUM,
        payload: { userId },
    };
};

/**
 * Set profile album posts has more data to show
 */
export const hasMoreDataAlbum = (userId: string) => {
    return {
        type: UserActionType.HAS_MORE_DATA_ALBUM,
        payload: { userId },
    };
};

/**
 * Set profile album posts has not data any more to show
 */
export const notMoreDataAlbum = (userId: string) => {
    return {
        type: UserActionType.NOT_MORE_DATA_ALBUM,
        payload: { userId },
    };
};

/**
 * Set last album page request of profile posts
 */
export const requestPageAlbum = (userId: string, page: number) => {
    return {
        type: UserActionType.REQUEST_PAGE_ALBUM,
        payload: { userId, page },
    };
};

/**
 * Set last album post identification of profile posts
 */
export const lastPostAlbum = (userId: string, lastPostId: string) => {
    return {
        type: UserActionType.LAST_POST_ALBUM,
        payload: { userId, lastPostId },
    };
};

/**
 * Set last page request of find people page
 */
export const increaseFindPagePeoplePage = () => {
    return {
        type: UserActionType.INCREASE_FIND_PEOPLE_PAGE,
    };
};

/**
 * Set last user identification of find people page
 */
export const lastUserPeople = (lastUserId: string) => {
    return {
        type: UserActionType.LAST_USER_PEOPLE,
        payload: { lastUserId },
    };
};

/**
 * Increase user follow count
 */
export const increaseFollowCountUser = (userId: string) => {
    return {
        type: UserActionType.INCREASE_FOLLOWING_COUNT_USER,
        payload: { userId },
    };
};

/**
 * Decrease user follow count
 */
export const decreaseFollowCountUser = (userId: string) => {
    return {
        type: UserActionType.DECREASE_FOLLOWING_COUNT_USER,
        payload: { userId },
    };
};

/**
 * Increase user share count
 */
export const increaseShareCountUser = (userId: string) => {
    return {
        type: UserActionType.INCREASE_SHARE_COUNT_USER,
        payload: { userId },
    };
};

/**
 * Decrease user share count
 */
export const decreaseShareCountUser = (userId: string) => {
    return {
        type: UserActionType.DECREASE_SHARE_COUNT_USER,
        payload: { userId },
    };
};

/**
 * Increase user vote count
 */
export const increaseVoteCountUser = (userId: string) => {
    return {
        type: UserActionType.INCREASE_VOTE_COUNT_USER,
        payload: { userId },
    };
};

/**
 * Decrease user vote count
 */
export const decreaseVoteCountUser = (userId: string) => {
    return {
        type: UserActionType.DECREASE_VOTE_COUNT_USER,
        payload: { userId },
    };
};

/**
 * Increase user post count
 */
export const increasePostCountUser = (userId: string) => {
    return {
        type: UserActionType.INCREASE_POST_COUNT_USER,
        payload: { userId },
    };
};

/**
 * Decrease user post count
 */
export const decreasePostCountUser = (userId: string) => {
    return {
        type: UserActionType.DECREASE_POST_COUNT_USER,
        payload: { userId },
    };
};
