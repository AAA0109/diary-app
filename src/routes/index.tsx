import React, { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { lazy } from '@loadable/component';
import { useLocation, useRoutes } from 'react-router';
import Page404 from 'pages/Page404';
import GuestGuard from 'guards/GuestGuard';
import AuthGuard from 'guards/AuthGuard';
import DashboardLayout from 'layouts/dashboard';
import LogoOnlyLayout from 'layouts/LogoOnlyLayout';
import LoadingScreen from 'components/LoadingScreen';

const Loadable = (Component: React.ComponentType) => (props: any) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { pathname } = useLocation();
    const isDashboard =
        !pathname.includes('/auth') &&
        !pathname.includes('/404') &&
        !pathname.includes('/505') &&
        !pathname.includes('/maintenance');
    return (
        <Suspense
            fallback={
                <LoadingScreen
                    sx={{
                        ...(!isDashboard && {
                            top: 0,
                            left: 0,
                            width: 1,
                            zIndex: 9999,
                            position: 'fixed',
                        }),
                        color: '#fff',
                        zIndex: (theme: any) => theme.zIndex.drawer + 1,
                    }}
                />
            }
        >
            <Component {...props} />
        </Suspense>
    );
};
// - Async Components
const AsyncStream = Loadable(lazy(() => import('pages/StreamPage')));
const AsyncDashboard = Loadable(lazy(() => import('pages/DashboardPage')));
const AsyncDiaryTopic = Loadable(lazy(() => import('pages/Diary/SelectTopics')));
const AsyncAllDiaries = Loadable(lazy(() => import('pages/Diary/AllDiaries')));
const AsyncPostDiary = Loadable(lazy(() => import('pages/Diary/PostDiary')));
const AsyncEditDiary = Loadable(lazy(() => import('pages/Diary/EditDiary')));
const AsyncViewDiary = Loadable(lazy(() => import('pages/Diary/ViewDiary')));
const AsyncViewSharedDiary = Loadable(lazy(() => import('pages/Diary/ViewSharedDiary')));
const AsyncAllChats = Loadable(lazy(() => import('pages/Chats/AllChats')));
const AsyncChatPage = Loadable(lazy(() => import('pages/Chats/ChatPage')));
const AsyncCreateChatGroupPage = Loadable(lazy(() => import('pages/Chats/CreateNewGroup')));
const AsyncProfile = Loadable(lazy(() => import('pages/ProfilePage')));
const AsyncPostPage = Loadable(lazy(() => import('pages/PostPage')));
// const AsyncPeople = Loadable(lazy(() => import('pages/MyFamilyPage')));
const AsyncSearch = Loadable(lazy(() => import('pages/SearchPage')));
const AsyncSupport = Loadable(lazy(() => import('pages/SupportPage')));

const AsyncSetting = Loadable(lazy(() => import('pages/AccountPage')));

// other page
const AsyncSignup = Loadable(lazy(() => import('pages/Auth/SignupPage')));
const AsyncEmailVerification = Loadable(lazy(() => import('pages/EmailVerifyPage')));
const AsyncAcceptInvitationPage = Loadable(lazy(() => import('pages/Auth/AcceptInvitationPage')));
const AsyncResetPassword = Loadable(lazy(() => import('pages/Auth/ResetPasswordPage')));
const AsyncChangePassword = Loadable(lazy(() => import('pages/Auth/ChangePasswordPage')));
const AsyncCreateFamilyPage = Loadable(lazy(() => import('pages/CreateFamilyPage')));
const AsyncLogin = Loadable(lazy(() => import('pages/Auth/LoginPage')));
const AsyncLoginSession = Loadable(lazy(() => import('pages/Auth/LoginSessionPage')));
const AsyncOnboardingPage = Loadable(lazy(() => import('pages/Auth/OnboardingPage')));
const AsyncQuotePage = Loadable(lazy(() => import('pages/QuotePage')));
const AsyncFamilyPage = Loadable(lazy(() => import('pages/Family/FamilyPage')));
const AsyncFamilyMotosPage = Loadable(lazy(() => import('pages/Family/AllMotos')));
const AsyncFamilyDiariesPage = Loadable(lazy(() => import('pages/Family/FamilyDiaries')));
const AsyncFamilySettingPage = Loadable(lazy(() => import('pages/Family/FamilySettings')));
const AsyncFamilyInvitePage = Loadable(lazy(() => import('pages/Family/AddMember')));
const AsyncCommunityHomePage = Loadable(lazy(() => import('pages/Community/Home')));
const AsyncCommunitySubforumPage = Loadable(lazy(() => import('pages/Community/ViewSubform')));
const AsyncCommunityThreadPage = Loadable(lazy(() => import('pages/Community/ViewThread')));
const AsyncCommunitySearchPage = Loadable(lazy(() => import('pages/Community/SearchThread')));

export default function Router() {
    return useRoutes([
        // authenticated routes
        {
            path: 'auth',
            children: [
                {
                    path: 'login',
                    element: (
                        <GuestGuard>
                            <AsyncLogin />
                        </GuestGuard>
                    ),
                },
                {
                    path: 'session',
                    element: (
                        <GuestGuard>
                            <AsyncLoginSession />
                        </GuestGuard>
                    ),
                },
                {
                    path: 'register',
                    element: (
                        <GuestGuard>
                            <AsyncSignup />
                        </GuestGuard>
                    ),
                },
                { path: 'login-unprotected', element: <AsyncLogin /> },
                { path: 'register-unprotected', element: <AsyncSignup /> },
                { path: 'family-invite/:token', element: <AsyncAcceptInvitationPage /> },
                { path: 'reset-password', element: <AsyncResetPassword /> },
                { path: 'change-password', element: <AsyncChangePassword /> },
                { path: 'verify-signup', element: <AsyncEmailVerification /> },
            ],
        },

        {
            path: 'new-family',
            element: <AuthGuard>
                <AsyncCreateFamilyPage />
            </AuthGuard>
        },

        {
            path: 'onboarding',
            element: <AuthGuard>
                <AsyncOnboardingPage />
            </AuthGuard>
        },
        {
            path: 'today_quotes',
            element: <AuthGuard>
                <AsyncQuotePage />
            </AuthGuard>
        },

        // dashboard routes
        {
            path: '/',
            element: (
                <AuthGuard>
                    <DashboardLayout />
                </AuthGuard>
            ),
            children: [
                {
                    path: '/',
                    element: <Navigate to="/today_quotes" />,
                },
                { path: 'dashboard', element: <AsyncDashboard /> },
                { path: 'diary/all', element: <AsyncAllDiaries /> },
                { path: 'diary/topics', element: <AsyncDiaryTopic /> },
                { path: 'diary/post', element: <AsyncPostDiary /> },
                { path: 'diary/edit/:diaryId', element: <AsyncEditDiary /> },
                { path: 'diary/view/:diaryId', element: <AsyncViewDiary /> },
                { path: 'stream', element: <AsyncStream /> },
                { path: 'my-family', element: <AsyncFamilyPage /> },
                { path: 'my-family/settings', element: <AsyncFamilySettingPage /> },
                { path: 'my-family/invite', element: <AsyncFamilyInvitePage /> },
                { path: 'family/:userId/diary', element: <AsyncFamilyDiariesPage /> },
                { path: 'motos/all', element: <AsyncFamilyMotosPage /> },
                { path: '@/:socialName', element: <AsyncProfile /> },
                { path: 'account', element: <AsyncSetting /> },
                { path: 'search/:category', element: <AsyncSearch /> },
                { path: 'posts/:urlKey', element: <AsyncPostPage /> },
                { path: 'support', element: <AsyncSupport /> },
                { path: 'chats', element: <AsyncAllChats /> },
                { path: 'chats/:isGroup/:chatId', element: <AsyncChatPage /> },
                { path: 'chats/new-group', element: <AsyncCreateChatGroupPage /> },
                { path: 'community', element: <AsyncCommunityHomePage /> },
                { path: 'community/:subforumId', element: <AsyncCommunitySubforumPage /> },
                { path: 'community/thread/:threadId', element: <AsyncCommunityThreadPage /> },
                { path: 'community/search', element: <AsyncCommunitySearchPage /> },
            ],
        },

        {
            path: '/',
            element: <LogoOnlyLayout />,
            children: [
                { path: 'diary/share-view/:diaryId', element: <AsyncViewSharedDiary /> },
            ],
        },
        {
            path: '*',
            element: <LogoOnlyLayout />,
            children: [
                { path: '404', element: <Page404 /> },
                { path: '*', element: <Navigate to="/404" replace /> },
            ],
        },
        { path: '*', element: <Navigate to="/404" replace /> },
    ]);
}
