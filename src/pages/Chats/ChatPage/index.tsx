import { useTranslation } from 'react-i18next';

import { Box, Button, CircularProgress, IconButton, InputAdornment, Skeleton, TextField, Typography, styled } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import useDiary from 'hooks/useDiary';
import { useSnackbar } from 'notistack';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from 'components/header/Header';
import { useDispatch } from 'react-redux';
import { setHeaderTitle, setNavigationStep } from 'redux/actions/globalActions';
import { ChatChannel } from 'core/domain/chats/chatChannel';
import ChatChannelAvatar from 'components/ChatChannelAvatar';
import moment from 'moment';
import PinIcon from 'components/icons/PinIcon';
import CopyIcon from 'components/icons/CopyIcon';

import { Chat } from 'core/domain/chats/chat';
import UserAvatar from 'components/UserAvatar';
import { ICommonService } from 'core/services/common/ICommonService';
import { provider } from 'socialEngine';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { getDateString } from './utils';
import { PATH_MAIN } from 'routes/paths';
import BackButton from 'components/backButton';
import useAuth from 'hooks/useAuth';
import { IChatService } from 'core/services/chats/IChatService';

const commonService: ICommonService = provider.get<ICommonService>(SocialProviderTypes.CommonService);
const chatsService: IChatService = provider.get<IChatService>(SocialProviderTypes.ChatService);

export default function ChatPage() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { isGroup, chatId } = useParams();

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { socket } = useDiary();
    const [channelInfo, setChannelInfo] = useState<ChatChannel>();
    const [messageList, setMessageList] = useState<Chat[]>([]);
    const [loadingChannelInfo, setLoadingChannelInfo] = useState(true);
    const messageListRef = useRef(null);
    const { user } = useAuth();

    useEffect(() => {
        dispatch<any>(setNavigationStep(3));
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('msgSent', (message) => {
                handleMsgSent(message);
            });

            socket.on('message', (message) => {
                enqueueSnackbar(`You have new message from ${message.from.customName ?? message.from.firstName}`, { variant: 'warning' });
                handleNewMessage(message);
            });

            socket.emit('read', {
                fromId: chatId,
                toId: user?.id,
                isGroup,
            });
        }
    }, [socket]);

    const handleMsgSent = (msg: Chat) => {
        setMessageList((prevMessageList) => prevMessageList.map(m => {
            if (m.createdAt === new Date(msg.createdAt!).getTime()) {
                m.isSent = true;
            }
            return m;
        }))
    }

    const handleNewMessage = (msg: Chat) => {
        setMessageList((prevMessageList) => [...prevMessageList, msg]);
        socket.emit('read', {
            toId: msg.toId,
            fromId: msg.fromId,
        });
    }

    const fetchChannelInfo = async () => {
        setLoadingChannelInfo(true);
        const res = await chatsService.getChatChannel(chatId!, isGroup!);
        setChannelInfo(res.channel);
        setLoadingChannelInfo(false);
        setMessageList(res.channel.messages ?? []);
    }

    useEffect(() => {
        fetchChannelInfo();
    }, []);

    const handleCopyMessageToClipboard = (msg: string) => {
        navigator.clipboard.writeText(msg);
        enqueueSnackbar("Copied Successfully!", {
            variant: 'success',
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
            },
        });
    }

    const handleKeyPress = (e: any) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            const msg = e.target.value;
            if (msg) {
                socket.emit('message', {
                    content: msg,
                    toId: chatId,
                    fromId: user?.id,
                    createdAt: moment().toISOString(),
                    type: 'text',
                    isGroup: isGroup === '1',
                    isSent: false,
                    seen: false,
                });
                setMessageList([...messageList, {
                    content: msg,
                    toId: chatId,
                    fromId: user?.id,
                    createdAt: Date.now(),
                    type: 'text',
                    isGroup: isGroup === '1',
                    isSent: false,
                    seen: false,
                } as Chat]);
                e.target.value = "";
            }
        }
    }

    useEffect(() => {
        if (messageListRef.current) {
            const msgList = messageListRef.current as any;
            msgList.scrollTop = msgList.scrollHeight;
        }
    }, [messageList]);

    const OutMessageComponent = (msg: Chat, hideTime: Boolean, hideInfo: Boolean) => {
        return <OutMessageBody>
            <Box>
                <OutMessagePane>
                    {msg.type === 'file' ? <MessageFile>
                        <PinIcon color="white" />
                        <a href={process.env.REACT_APP_GATEWAY + msg.link!} target='_blank' rel="noopener noreferrer" download style={{ color: 'white' }}>{msg.content ?? ''}</a>
                    </MessageFile> : (msg.content ?? '')}
                </OutMessagePane>
                {!hideTime && <MessageTime>{moment(msg.createdAt).format('hh:mm a')}</MessageTime>}
            </Box>
        </OutMessageBody>
    }

    const InMessageComponent = (msg: Chat, hideTime: Boolean, hideInfo: Boolean) => {
        const sender = channelInfo?.users?.find(m => m.id === msg.fromId);
        return <InMessageBody>
            {!hideInfo ? <UserAvatar user={sender!} /> : <Box width={40} />}
            <Box>
                {!hideInfo && <InMessageSenderName>
                    {sender?.fullName}
                </InMessageSenderName>}
                <InMessagePane>
                    {msg.type === 'file' ? <MessageFile>
                        <PinIcon color="black" />
                        <a href={process.env.REACT_APP_GATEWAY + msg.link!} target='_blank' rel="noopener noreferrer" download style={{ color: 'black' }}>{msg.content ?? ''}</a>
                    </MessageFile> : (msg.content ?? '')}
                </InMessagePane>
                {!hideTime && <MessageTime>{moment(msg.createdAt).format('hh:mm a')}</MessageTime>}
            </Box>
        </InMessageBody>
    }

    const UploadingComponent = (msg: Chat) => {
        return <OutMessageBody>
            <Skeleton width={240} height={80} />
        </OutMessageBody>
    }

    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const msgTime = Date.now();
            setMessageList([...messageList, {
                content: file.name,
                toId: chatId,
                fromId: user?.id,
                createdAt: msgTime,
                type: 'file',
                isGroup: isGroup === '1',
                isSent: false,
                seen: false,
                isUploading: true,
            } as Chat]);
            const res = await commonService.fileUpload(file);
            if (res.url) {
                socket.emit('message', {
                    content: file.name,
                    toId: chatId,
                    link: res.url,
                    fromId: user?.id,
                    createdAt: moment().toISOString(),
                    type: 'file',
                    isGroup: isGroup === '1',
                    isSent: false,
                    seen: false,
                });
                setMessageList(prevMessageList => prevMessageList.map(m => {
                    if (m.createdAt === msgTime) {
                        m.link = res.url;
                        m.isUploading = false;
                    }
                    return m;
                }))
                e.target.files = [];
            }
        }
    };

    const handleClickUploadButton = () => {
        inputRef.current?.click();
    }

    const showMessageList = (msgList: Chat[]) => {
        let msgDate = '';
        return msgList.map((msg, index) => {
            const msgTime = moment(msg.createdAt).format('hh:mm a');
            const nextMsgTime = index + 1 < msgList.length ? moment(msgList[index + 1].createdAt).format('hh:mm a') : '';
            const prevMsgTime = index - 1 > -1 && msgList[index].fromId === msgList[index - 1].fromId ? moment(msgList[index - 1].createdAt).format('hh:mm a') : '';
            let hideTime = false;
            let hideInfo = false
            if (msgTime === nextMsgTime) {
                hideTime = true;
            }
            if (msgTime === prevMsgTime) {
                hideInfo = true;
            }
            const msgDateStr = getDateString(new Date(msg.createdAt!));
            if (msgDateStr !== msgDate) {
                msgDate = msgDateStr;
                return <Box key={index}>
                    <DateText>{msgDate}</DateText>
                    {showMessage(msg, hideTime, hideInfo)}
                </Box>
            }
            return showMessage(msg, hideTime, hideInfo);
        })
    }

    const showMessage = (msg: Chat, hideTime: Boolean, hideInfo: Boolean) => {
        return msg.isUploading ? UploadingComponent(msg) : (
            msg.fromId === user?.id ? OutMessageComponent(msg, hideTime, hideInfo) : InMessageComponent(msg, hideTime, hideInfo)
        )
    }

    return (
        <RootStyle>
            {
                loadingChannelInfo ? <LoadingPane>
                    <CircularProgress color="primary" style={{ margin: "auto" }} />
                </LoadingPane>
                    :
                    <Box>
                        <CustomHeader>
                            <Header child={
                                <Box display="flex" gap="12px" alignItems="center" marginLeft="6px">
                                    <ChatChannelAvatar chatChannel={channelInfo!} />
                                    <Box>
                                        <ChannelName>{channelInfo?.name}</ChannelName>
                                        <ChannelStatus>{channelInfo?.isGroup ? `${channelInfo.users?.length} MEMBERS, ` : ''} ACTIVE NOW</ChannelStatus>
                                    </Box>
                                </Box>
                            }
                                beforeIcon={
                                    <BackButton handleBack={() => navigate(PATH_MAIN.chats.home)} />
                                } />
                        </CustomHeader>
                        <MessageList ref={messageListRef}>
                            {showMessageList(messageList)}
                        </MessageList>
                        <MessageBottomBar>
                            <MessageInput>
                                <PinIcon color="#000E08" style={{ cursor: 'pointer' }} onClick={handleClickUploadButton} />
                                <input ref={inputRef} type="file" accept="*" onChange={handleFileUpload} />
                                <MessageTextField
                                    placeholder='Write your message'
                                    name='message'
                                    onKeyDown={handleKeyPress}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <CopyIcon onClick={handleCopyMessageToClipboard} style={{ cursor: "pointer", color: '#797C7B', marginRight: '12px' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </MessageInput>
                        </MessageBottomBar>
                    </Box>}
        </RootStyle>
    );
}

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
    padding: "24px 0",
    margin: "0 auto",
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 0,
}));

const CustomHeader = styled('div')(() => ({
    padding: '2px 24px',
}))

const MessageList = styled('div')(() => ({
    height: 'calc(100vh - 190px)',
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '16px 8px',
    scrollBehavior: 'smooth',
    boxShadow: '0px 4px 2px -2px rgba(17, 18, 34, 0.06)',

    '&::-webkit-scrollbar': {
        width: '6px',
        height: '6px',
    },
    '&::-webkit-scrollbar-track': {
        borderRadius: '10px',
        background: 'rgba(0,0,0,0.1)',
    },
    '&::-webkit-scrollbar-thumb': {
        borderRadius: '10px',
        background: 'rgba(0,0,0,0.2)',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: 'rgba(0,0,0,0.4)',
    },
    '&::-webkit-scrollbar-thumb:active': {
        background: 'rgba(0,0,0,.9)',
    }
}));

const LoadingPane = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '50px 0',
}))

const ChannelName = styled(Typography)(() => ({
    fontSize: '14px',
    fontWeight: 500,
    color: '#000E08',
}))

const ChannelStatus = styled(Typography)(() => ({
    fontSize: '12px',
    fontWeight: 400,
    color: '#797C7B',
}))

const MessageBottomBar = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTop: '1px solid #E0F0EA',
    zIndex: 1,
    justifyContent: 'center',
}))

const MessageInput = styled('div')(() => ({
    padding: '18px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
}))

const MessageTextField = styled(TextField)(() => ({
    width: '100%',
    '& input': {
        "&:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 100px #F5FAFC inset !important",
            WebkitTextFillColor: "default",
        },
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: 12,
        padding: "0",
        backgroundColor: '#F3F6F6 !important',
        '& fieldset': {
            borderColor: 'transparent !important',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#469AD0 !important',
        },
        '&.Mui-focused svg': {
            color: "#797C7B !important",
        },
    },
}));

const OutMessageBody = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    margin: '12px 6px',
}))

const OutMessagePane = styled('div')(() => ({
    backgroundColor: '#469AD0',
    borderRadius: '12px 0px 12px 12px',
    padding: '12px 16px',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
    maxWidth: '320px',
    minWidth: '50px',
    color: 'white',
}))

const InMessageBody = styled('div')(() => ({
    display: 'flex',
    margin: '12px 6px',
    gap: '12px',
}))

const InMessageSenderName = styled(Typography)(() => ({
    fontSize: '12.5px',
    fontWeight: 700,
    color: '#000E08',
    textAlign: 'left',
    margin: '8px 0',
}))

const InMessagePane = styled('div')(() => ({
    backgroundColor: '#F2F7FB',
    borderRadius: '0px 12px 12px 12px',
    padding: '12px 16px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    color: 'black',
    maxWidth: '320px',
    minWidth: '50px',
    margin: '0 12px',
}))

const MessageTime = styled(Typography)(() => ({
    fontSize: '10px',
    fontWeight: 400,
    color: '#797C7B',
    margin: '4px 0',
    textAlign: 'right',
    marginBottom: '12px',
}))

const MessageFile = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    '& a': {
        textDecoration: 'underline',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
    },
}))

const DateText = styled(Typography)(() => ({
    fontSize: '12px',
    fontWeight: 600,
    textAlign: 'center',
    margin: '12px 0',
}))
