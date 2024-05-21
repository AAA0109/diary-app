// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
    return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_MAIN = '/';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
    root: ROOTS_AUTH,
    login: path(ROOTS_AUTH, '/login'),
    loginSession: path(ROOTS_AUTH, '/session'),
    loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
    register: path(ROOTS_AUTH, '/register'),
    registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
    resetPassword: path(ROOTS_AUTH, '/reset-password'),
    verifySignup: path(ROOTS_AUTH, '/verify-signup'),
};

export const PATH_PAGE = {
    comingSoon: '/coming-soon',
    maintenance: '/maintenance',
    pricing: '/pricing',
    payment: '/payment',
    about: '/about-us',
    contact: '/contact-us',
    faqs: '/faqs',
    page404: '/404',
    page500: '/500',
    components: '/components',
};
export const PATH_MAIN = {
    root: ROOTS_MAIN,
    onboarding: path(ROOTS_MAIN, 'onboarding'),
    today_quotes: path(ROOTS_MAIN, 'today_quotes'),
    family: {
        home: path(ROOTS_MAIN, 'my-family'),
        new: path(ROOTS_MAIN, 'new-family'),
        motos: path(ROOTS_MAIN, 'motos/all'),
        diaries: (userId: string) => path(ROOTS_MAIN, `family/${userId}/diary`),
        addMember: path(ROOTS_MAIN, 'my-family/invite'),
        settings: path(ROOTS_MAIN, 'my-family/settings'),
    },
    user: {
        home: path(ROOTS_MAIN, 'dashboard'),
        community: path(ROOTS_MAIN, 'community'),
        profile: path(ROOTS_MAIN, '@/:socialName'),
        account: path(ROOTS_MAIN, 'account'),
        acceptInvitation: (token: string) => path(ROOTS_MAIN, `auth/family-invite/${token}`),
    },
    diary: {
        allDiaries: path(ROOTS_MAIN, 'diary/all'),
        diaryTopic: path(ROOTS_MAIN, 'diary/topics'),
        post: path(ROOTS_MAIN, 'diary/post'),
        editDiary: (diaryId: string) => path(ROOTS_MAIN, `diary/edit/${diaryId}`),
        viewDiary: (diaryId: string) => path(ROOTS_MAIN, `diary/view/${diaryId}`),
        viewSharedDiary: (diaryId: string, token: string) => path(ROOTS_MAIN, `diary/share-view/${diaryId}?token=${token}`),
    },
    chats: {
        home: path(ROOTS_MAIN, 'chats'),
        chat: (chatId: string, isGroup: boolean) => path(ROOTS_MAIN, `chats/${isGroup ? 1 : 0}/${chatId}`),
        createNewGroup: path(ROOTS_MAIN, 'chats/new-group'),
    },
    community: {
        home: path(ROOTS_MAIN, 'community'),
        subform: (subforumId: string) => path(ROOTS_MAIN, `community/${subforumId}`),
        thread: (threadId: string) => path(ROOTS_MAIN, `community/thread/${threadId}`),
        search: (searchKey: string) => path(ROOTS_MAIN, `community/search?searchKey=${encodeURIComponent(searchKey)}`),
    },
    search: {
        root: path(ROOTS_MAIN, '/search/:category'),
    },
    support: path(ROOTS_MAIN, '/support'),
};

export const PATH_DOCS = 'https://telar.dev/docs/start/introduction';
