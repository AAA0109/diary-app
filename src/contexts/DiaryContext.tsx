import PropTypes from 'prop-types';
import React, { createContext, useCallback, useEffect, useState } from 'react';
// hooks
import { IDiaryService } from 'core/services/diary/IDiaryService';
import { provider } from 'socialEngine';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { DiaryTopic } from 'core/domain/diary/diaryTopic';
import { Diary } from 'core/domain/diary/diary';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATH_MAIN } from 'routes/paths';
import useLocalStorage from '../hooks/useLocalStorage';
import useAuth from 'hooks/useAuth';
import { sortBy } from 'lodash';
import { IChatService } from 'core/services/chats/IChatService';
import { ChatChannel } from 'core/domain/chats/chatChannel';
import io, { Socket } from 'socket.io-client';
import addNotification from 'react-push-notification';
import { Notification } from 'core/domain/notifications/notification';
import { useSnackbar } from 'notistack';

const diaryService: IDiaryService = provider.get<IDiaryService>(SocialProviderTypes.DiaryService);

const initialState: {
    topicList: DiaryTopic[];
    notificationList: Notification[];
    selectedTopic: string;
} = {
    topicList: [],
    notificationList: [],
    selectedTopic: "",
};

const DiaryContext = createContext({
    ...initialState,
    onClearSelection: () => Promise.resolve(),
    fetchTopicList: () => Promise.resolve(),
    onSelectTopic: (selectedTopic: string) => Promise.resolve(),
    fetchDiaryList: (params?: any, showLoading?: boolean) => Promise.resolve([]),
    fetchDiary: (diaryId: string, showLoading?: boolean) => Promise.resolve({ diary: new Diary() }),
    goToTopicPage: () => Promise.resolve(),
    fetchNotificationList: () => Promise.resolve(),
    loadingDiaryList: true,
    loadingDiary: true,
    socket: io(process.env.REACT_APP_CHAT_GATEWAY!, { query: { user_id: '' } }),
});

export interface DiaryProviderProps {
    children?: React.ReactNode;
}

function DiaryProvider({ children }: { children: React.ReactNode }) {

    const navigate = useNavigate();
    const { user } = useAuth();

    const [diarySetting, setDiarySetting] = useLocalStorage('diarySetting', {});
    const [notificationList, setNotificationList] = useState<Notification[]>([]);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [loadingDiaryList, setLoadingDiaryList] = useState(true);
    const [loadingDiary, setLoadingDiary] = useState(true);

    const [socket, setSocket] = useState<Socket | null>(null);

    const location = useLocation();

    useEffect(() => {
        if (user?.id && !socket) {
            setSocket(io(process.env.REACT_APP_CHAT_GATEWAY!, { query: { user_id: user?.id } }))
        }
    }, [user])


    const fetchDiaryList = async (params?: any, showLoading?: boolean) => {
        if (showLoading) {
            setLoadingDiaryList(true);
        }
        const { diaryList } = await diaryService.getDiaryList(params);
        setLoadingDiaryList(false);
        return diaryList;
    }

    const fetchDiary = async (diaryId: string, showLoading?: boolean) => {
        if (showLoading) {
            setLoadingDiary(true);
        }
        const diary = await diaryService.getDiaryData(diaryId);
        setLoadingDiary(false);
        return diary;
    }

    const fetchTopicList = async () => {
        const { diaryTopics } = await diaryService.getDiaryTopics();
        setDiarySetting({
            ...diarySetting,
            topicList: diaryTopics,
        });
    };

    const onSelectTopic = (selectedTopic: string) => {
        setDiarySetting({
            ...diarySetting,
            selectedTopic,
        });
    };

    const onClearSelection = () => {
        setDiarySetting({
            ...diarySetting,
            selectedTopic: "",
        });
    };

    const goToTopicPage = () => {
        navigate(PATH_MAIN.diary.diaryTopic);
        setDiarySetting({
            ...diarySetting,
            selectedTopic: "",
        });
    }

    const fetchNotificationList = async () => {
        const { notificationList } = await diaryService.getNotificationList();
        setNotificationList(notificationList);
    }

    useEffect(() => {
        if (user) {
            fetchTopicList();
        }
    }, [user]);

    useEffect(() => {
        if (socket) {
            socket.on('reminder', () => {
                addNotification({
                    title: 'Daily Reminder',
                    message: 'Just a friendly reminder to capture your thoughts and experiences in your diary today. Your insights are valuable!',
                    theme: 'light',
                    duration: 7000,
                    icon: 'https://haruhana-happytown.com/favicon/apple-touch-icon.png',
                    native: true // when using native, your OS will handle theming.
                });
            });
            socket.on('notification', (notification: any) => {
                console.log(notification)
                enqueueSnackbar(notification.content, { variant: 'warning' });
                addNotification({
                    title: notification.title ?? 'Notification',
                    message: notification.content ?? 'Check your notification page for more details.',
                    theme: 'light',
                    duration: 7000,
                    icon: 'https://haruhana-happytown.com/favicon/apple-touch-icon.png',
                    native: true // when using native, your OS will handle theming.
                });
            })
            socket.on('notification-update', () => {
                fetchNotificationList();
            })

            return () => {
                socket?.off('reminder');
                socket?.off('notification');
                socket?.off('notificaiton-update');
            }
        }
    }, [socket]);

    useEffect(() => {
        if (socket) {
            socket?.off('message');
            if (!location.pathname.startsWith('/chats/')) {
                socket.on('message', (message) => {
                    console.log(message)
                    enqueueSnackbar(`You have new message from ${message.from.customName ?? message.from.firstName}`, { variant: 'warning' });
                    addNotification({
                        title: `New Message from ${message.from.customName ?? message.from.firstName}`,
                        message: message.content ?? 'Check new messages on Message page.',
                        theme: 'light',
                        duration: 7000,
                        icon: 'https://haruhana-happytown.com/favicon/apple-touch-icon.png',
                        native: true // when using native, your OS will handle theming.
                    });
                });
                return () => {
                    socket?.off('message');
                }
            }
        }
    }, [location.pathname, socket]);

    return (
        <DiaryContext.Provider
            value={{
                ...diarySetting,
                fetchTopicList,
                onClearSelection,
                onSelectTopic,
                fetchDiaryList,
                goToTopicPage,
                fetchDiary,
                loadingDiaryList,
                loadingDiary,
                socket,
                fetchNotificationList,
                notificationList,
            }}
        >
            {children}
        </DiaryContext.Provider>
    );
}

export { DiaryProvider, DiaryContext };
