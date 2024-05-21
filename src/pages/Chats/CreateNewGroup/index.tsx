import { useTranslation } from 'react-i18next';

import { AvatarGroup, Box, Button, CircularProgress, IconButton, InputAdornment, Stack, TextField, Typography, styled } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import useDiary from 'hooks/useDiary';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import Header from 'components/header/Header';
import { useDispatch } from 'react-redux';
import { setHeaderTitle, setNavigationStep } from 'redux/actions/globalActions';
import { Diary } from 'core/domain/diary/diary';
import DiaryPaneComponent from 'components/diary/diaryPane';
import FilterIcon from 'components/icons/FilterIcon';
import FilterDiariesModal from 'components/diary/filterDiariesModal';
import { SortByFilterList } from 'constants/sortByFilterList';
import MyAvatar from 'components/MyAvatar';
import AddRoundedIcon from 'components/icons/AddRoundedIcon';
import { ChatChannel } from 'core/domain/chats/chatChannel';
import FamilyAvatar from 'components/FamilyAvatar';
import ChatChannelAvatar from 'components/ChatChannelAvatar';
import moment from 'moment';
import { PATH_MAIN } from 'routes/paths';
import BackButton from 'components/backButton';
import { DBUser } from 'core/domain/users/dbUser';
import useAuth from 'hooks/useAuth';
import UserAvatar from 'components/UserAvatar';
import { EmotionList } from 'constants/emtionList';
import { CloseOutlined } from '@mui/icons-material';
import CameraIcon from 'components/icons/CameraIcon';
import CheckIcon from 'components/icons/CheckIcon';
import { IChatService } from 'core/services/chats/IChatService';
import { provider } from 'socialEngine';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { ICommonService } from 'core/services/common/ICommonService';

const chatService: IChatService = provider.get<IChatService>(SocialProviderTypes.ChatService);
const commonService: ICommonService = provider.get<ICommonService>(SocialProviderTypes.CommonService);

export default function CreateNewGroup() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { user } = useAuth();
    const [selectedUsers, setSelectedUsers] = useState<DBUser[]>([]);
    const [groupName, setGroupName] = useState<string>('');
    const [previewImage, setPreviewImage] = useState('')
    const [creatingGroup, setCreatingGroup] = useState(false);

    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        dispatch<any>(setHeaderTitle("Message Board"));
        dispatch<any>(setNavigationStep(3));
    }, []);

    const handleSelectUser = (user: DBUser) => {
        setSelectedUsers([...selectedUsers, user]);
    }

    const handleUnselectUser = (user: DBUser) => {
        setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
    }

    const handleChangeGroupName = (e: any) => {
        setGroupName(e.target.value);
    }

    const handleClickUploadButton = () => {
        inputRef.current?.click();
    }

    const handleFileSelected = (e: any) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file) {
                setPreviewImage(URL.createObjectURL(file));
            }
        }
    }

    const handleCreateGroup = async () => {
        let image = '';
        if (inputRef.current?.files?.[0]) {
            const uploadingRes = await commonService.fileUpload(inputRef.current?.files?.[0]!);
            image = process.env.REACT_APP_GATEWAY + uploadingRes.url;
        }
        const res = await chatService.createNewGroup(groupName, selectedUsers, image);
        if (res.error) {
            enqueueSnackbar(res.error, { variant: 'error' });
            return;
        }
        enqueueSnackbar('Create group successfully', { variant: 'success' });
        navigate(PATH_MAIN.chats.home);
    }

    return (
        <Box>
            <RootStyle>
                <Header beforeIcon={<BackButton handleBack={() => navigate(PATH_MAIN.chats.home)} />} />
                <Box display='flex' gap='12px' marginY="12px">
                    <ImageSelectButton onClick={handleClickUploadButton} style={{ backgroundImage: previewImage ? `url(${previewImage})` : '#969696', }}>
                        {!previewImage && <CameraIcon width="26px" height="26px" />}
                    </ImageSelectButton>
                    <input ref={inputRef} type="file" accept=".jpg, .jpeg, .png" onChange={handleFileSelected} />
                    <GroupNameTextField
                        placeholder='Type Group Subject Here.....'
                        name='groupName'
                        onChange={handleChangeGroupName}
                    />
                </Box>
                <ParticipantsLabel>
                    Participants: {selectedUsers.length}
                </ParticipantsLabel>
                {selectedUsers.length > 0 ?
                    <SelectedUsers direction="row" spacing={2} margin="0 20px" marginTop="12px">
                        {selectedUsers?.map(user => <Box display='flex' flexDirection='column' alignItems='center'>
                            <MemberInfo>
                                <UserAvatar user={user!} />
                                <UnSelectButton onClick={() => handleUnselectUser(user)}>
                                    <CloseOutlined style={{ fontSize: '8px', color: 'white' }} />
                                </UnSelectButton>
                            </MemberInfo>
                            <MemberNameText>{user.firstName}</MemberNameText>
                        </Box>)}
                    </SelectedUsers>
                    : <></>}
                <MainPane>
                    {
                        (user?.family?.members?.length) ?
                            <MemberList>
                                {user?.family?.members?.filter(m => m.id !== user.id && !selectedUsers?.some(u => u.id === m.id))?.map((member, index) => <Button style={{ display: "flex", gap: "12px", justifyContent: 'start', alignItems: "center", margin: "12px 0", width: '100%', padding: '8px' }} key={index} onClick={() => handleSelectUser(member)}>
                                    <Box>
                                        <UserAvatar user={member} />
                                    </Box>
                                    <Box>
                                        <MemberName>{member.fullName}</MemberName>
                                        <MemberEmotion>{EmotionList.find((emotion) => emotion.key === member?.currentEmotion!)?.text}</MemberEmotion>
                                    </Box>
                                </Button>
                                )}
                            </MemberList>
                            :
                            <Typography fontSize="30px" fontWeight="900" padding="50px 10px" color="rgba(0,0,0,0.6)" textAlign="center">No family yet ...</Typography>

                    }
                </MainPane>
                <ConfirmButton disabled={selectedUsers.length < 1 || groupName.length < 1} onClick={handleCreateGroup}>
                    <CheckIcon />
                </ConfirmButton>
            </RootStyle>
        </Box>
    );
}

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
    padding: "24px 12px",
    margin: "0 auto",
    minHeight: '100vh',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 0,
}));

const MemberList = styled('div')(() => ({
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

const SelectedUsers = styled(Stack)(() => ({
    overflowX: 'auto',

    padding: '10px 0',

    '&::-webkit-scrollbar': {
        width: '6px',
        height: '6px',
    },
    '&::-webkit-scrollbar-track': {
        borderRadius: '10px',
        background: 'rgba(255,255,255,0.1)',
    },
    '&::-webkit-scrollbar-thumb': {
        borderRadius: '10px',
        background: 'rgba(255,255,255,0.2)',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: 'rgba(255,255,255,0.4)',
    },
    '&::-webkit-scrollbar-thumb:active': {
        background: 'rgba(255,255,255,.9)',
    }
}))

const MainPane = styled('div')(() => ({
    background: '#fff',
    borderTopLeftRadius: '40px',
    borderTopRightRadius: '40px',
    flex: '1',
    padding: '20px',
}))

const MemberName = styled(Typography)(() => ({
    fontSize: '16px',
    fontWeight: 500,
    color: '#000E08',
    textAlign: 'left',
}))

const MemberEmotion = styled(Typography)(() => ({
    fontSize: '12px',
    fontWeight: 400,
    color: '#797C7B',
    textAlign: 'left',
}))

const MemberInfo = styled('div')(() => ({
    position: 'relative',
}))

const MemberNameText = styled(Typography)(() => ({
    fontSize: '12px',
    fontWeight: 400,
    textAlign: 'center',
    marginTop: '4px',
}))

const UnSelectButton = styled(Button)(() => ({
    width: '13px',
    minWidth: '13px',
    height: '13px',
    padding: '1px',
    borderRadius: '50%',
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    background: '#77777777',
    '&:hover': {
        background: '#55555577',
    }
}))

const MemberListTitle = styled(Typography)(() => ({
    fontSize: '15px',
    fontWeight: 600,
    margin: '16px 6px',
}))

const ImageSelectButton = styled(Button)(() => ({
    width: '50px',
    minWidth: '50px',
    height: '50px',
    // padding: '1px',
    borderRadius: '50%',
    backgroundColor: '#969696',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    '&:hover': {
        backgroundColor: '#777',
    }
}))


const GroupNameTextField = styled(TextField)(() => ({
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
        backgroundColor: 'rgba(243, 246, 246, 0.9) !important',
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

const ParticipantsLabel = styled(Typography)(() => ({
    fontSize: '12px',
    fontWeight: 500,
    color: '#C1C1C1',
    textAlign: 'left',
    marginTop: '16px',
}))

const ConfirmButton = styled(Button)(() => ({
    position: 'absolute',
    bottom: '20px',
    right: '30px',
    width: '50px',
    minWidth: '50px',
    height: '50px',
    borderRadius: '12px',
    backgroundColor: '#469AD0',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#469AD0',
        transform: 'scale(1.05)',
        transition: 'all 0.3s ease',
    },
    '&:disabled': {
        backgroundColor: '#C1C1C1',
        color: '#eee',
        cursor: 'no-drop !important',
    }
}))