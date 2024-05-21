import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useBus from 'use-bus';
import ThemeConfig from 'theme';
import ThemeLocalization from 'components/ThemeLocalization';
import Router from 'routes/index';
import NotistackProvider from 'components/NotistackProvider';
import LoadingScreen from 'components/LoadingScreen';
import useAuth from 'hooks/useAuth';
import { Notifications } from 'react-push-notification';
import { DiaryProvider } from 'contexts/DiaryContext';

const App = () => {
    const navigate = useNavigate();
    useBus('@@ui/navigate', (action) => navigate(action.payload.url), []);
    const { isInitialized } = useAuth();

    return (
        <ThemeConfig>
            <ThemeLocalization>
                <Notifications />
                <NotistackProvider>
                    <DiaryProvider>

                        {isInitialized ? <Router /> : <LoadingScreen />}
                    </DiaryProvider>
                </NotistackProvider>
            </ThemeLocalization>
        </ThemeConfig>
    );
};

export default App;
