import { useTranslation } from 'react-i18next';

import { Box, Button, CircularProgress, Typography, styled } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import useDiary from 'hooks/useDiary';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import Header from 'components/header/Header';
import { useDispatch } from 'react-redux';
import { setHeaderTitle, setNavigationStep } from 'redux/actions/globalActions';
import { SortByFilterList } from 'constants/sortByFilterList';
import MyAvatar from 'components/MyAvatar';
import AddRoundedIcon from 'components/icons/AddRoundedIcon';
import { ChatChannel } from 'core/domain/chats/chatChannel';
import ChatChannelAvatar from 'components/ChatChannelAvatar';
import moment from 'moment';
import { PATH_MAIN } from 'routes/paths';
import { IChatService } from 'core/services/chats/IChatService';
import { provider } from 'socialEngine';
import { SocialProviderTypes } from 'core/socialProviderTypes';

const chatsService: IChatService = provider.get<IChatService>(SocialProviderTypes.ChatService);

export default function AllChats() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { socket } = useDiary();
    const [channelList, setChannelList] = useState<ChatChannel[]>([]);
    const [loadingChannelList, setLoadingChannelList] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        dispatch<any>(setHeaderTitle("Message Board"));
        dispatch<any>(setNavigationStep(3));
        updateChannelList();
        socket.on('message', () => {
            updateChannelList(false);
        });
    }, []);

    const updateChannelList = async (isLoading = true) => {
        if (isLoading) setLoadingChannelList(true);
        const { channels } = await chatsService.getAllChatChannels();
        setChannelList(channels);
        if (isLoading) setLoadingChannelList(false);
    }

    const goToCreateNewGroup = () => {
        navigate(PATH_MAIN.chats.createNewGroup);
    }

    return (
        <Box>
            <RootStyle>
                <Header beforeIcon={<></>} trailing={
                    <Box display="flex" gap="16px" alignItems="center">
                        <AddRoundedIcon color="#555" style={{ cursor: 'pointer' }} onClick={goToCreateNewGroup} />
                        <MyAvatar size={40} fontSize="20px" />
                    </Box>
                } />
                <MainPane>
                    {
                        loadingChannelList ? <LoadingPane>
                            <CircularProgress color="primary" style={{ margin: "auto" }} />
                        </LoadingPane>
                            :
                            (channelList.length === 0 ?
                                <Typography fontSize="30px" fontWeight="900" padding="50px 10px" color="rgba(0,0,0,0.6)" textAlign="center">No family yet ...</Typography>
                                :
                                <ChannelList>
                                    {channelList.map((channel, index) => <Button style={{ display: "flex", gap: "12px", justifyContent: 'start', alignItems: "center", margin: "12px 0", width: '100%', padding: '8px' }} key={index} onClick={() => navigate(PATH_MAIN.chats.chat(channel.id, channel.isGroup))}>
                                        <Box>
                                            <ChatChannelAvatar chatChannel={channel} />
                                        </Box>
                                        <Box>
                                            <ChannelName>{channel.name}</ChannelName>
                                            <ChannelLastMessage>{channel.lastMessage?.content ?? 'No message'}</ChannelLastMessage>
                                        </Box>
                                        <Box marginLeft="auto">
                                            {channel.lastMessage?.createdAt && <ChannelLastMessage>{moment(channel.lastMessage?.createdAt).fromNow()}</ChannelLastMessage>}
                                            {Boolean(channel.unReadCount) && <UnReadCount>
                                                {channel.unReadCount}
                                            </UnReadCount>}
                                        </Box>
                                    </Button>
                                    )}
                                </ChannelList>
                            )
                    }
                </MainPane>
            </RootStyle>
        </Box>
    );
}

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
    padding: "24px 12px",
    margin: "0 auto",
    minHeight: 'calc(100vh - 80px)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 0,
}));

const ChannelList = styled('div')(() => ({
    position: 'relative',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    padding: '12px',
    borderRadius: '12px',
}));

const LoadingPane = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '50px 0',
}))

const MainPane = styled('div')(() => ({
    background: '#fff',
    borderTopLeftRadius: '40px',
    borderTopRightRadius: '40px',
    flex: '1',
    marginTop: '40px',
    padding: '20px',
}))

const ChannelName = styled(Typography)(() => ({
    fontSize: '16px',
    fontWeight: 500,
    color: '#000E08',
    textAlign: 'left',
}))

const ChannelLastMessage = styled(Typography)(() => ({
    fontSize: '10px',
    fontWeight: 400,
    color: '#797C7B',
    textAlign: 'left',
}))

const UnReadCount = styled(Typography)(() => ({
    fontSize: '11px',
    fontWeight: 400,
    color: 'white',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '#F04A4C',
    padding: '2px',
    marginLeft: 'auto',
}))
