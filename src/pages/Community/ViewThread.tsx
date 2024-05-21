import { useTranslation } from 'react-i18next';

import { Box, Button, CircularProgress, IconButton, InputAdornment, TextField, Typography, styled } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from 'components/header/Header';
import { useDispatch } from 'react-redux';
import { setHeaderTitle, setNavigationStep } from 'redux/actions/globalActions';
import FilterIcon from 'components/icons/FilterIcon';
import { ICommunityService } from 'core/services/community/ICommunityService';
import { provider } from 'socialEngine';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import { CommunityForum } from 'core/domain/community/forum';
import FilterForumsModal from 'components/community/filterForumsModal';
import CommunityIcon from 'components/icons/CommunityIcon';
import CommunicationIcon from 'components/icons/CommunicationIcon';
import { CommunitySubforum } from 'core/domain/community/subforum';
import PlusRounded from 'components/icons/PlusRounded';
import PlusOutlined from 'components/icons/PlusOutlined';
import PostThreadModal from 'components/community/postThreadModal';
import moment from 'moment';
import useAuth from 'hooks/useAuth';
import HeartIcon from 'components/icons/HeartIcon';
import HeartOutlineIcon from 'components/icons/HeartOutlineIcon';
import ThreadItem from 'components/community/threadItem';
import { CommunityThread } from 'core/domain/community/thread';
import UserAvatar from 'components/UserAvatar';
import CommentsIcon from 'components/icons/CommentsIcon';
import { CloseOutlined, DeleteOutline, RemoveRedEyeOutlined } from '@mui/icons-material';
import SendIcon from 'components/icons/SendIcon';
import { ThreadComment } from 'core/domain/community/threadComment';
import { hummanizeDateDiff } from 'utils/global';
import ConfirmModal from 'components/confirmModal';
import PinIcon from 'components/icons/PinIcon';

const SortKeys = ['recent', 'views', 'replies', 'popularity'];

const communityService: ICommunityService = provider.get<ICommunityService>(SocialProviderTypes.CommunityService);

export default function ViewThread() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { threadId } = useParams();

    const { user } = useAuth();

    const [threadData, setThreadData] = useState<CommunityThread>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLike, setIsLike] = useState((threadData?.likes?.findIndex(e => e.userId?.toString() === user?.id?.toString()) ?? -1) >= 0);
    const [likeCount, setLikeCount] = useState(threadData?.likes?.length ?? 0);
    const [newComment, setNewComment] = useState('');
    const [showReplyComment, setShowReplyComment] = useState<string | null>(null);
    const [replyComment, setReplyComment] = useState('');
    const [showDeleteComment, setShowDeleteComment] = useState<string | null>(null);

    useEffect(() => {
        dispatch<any>(setHeaderTitle("Thread"));
        dispatch<any>(setNavigationStep(4));
    }, []);

    const fetchThreadData = async (showLoading = true) => {
        if (showLoading) setIsLoading(true);
        const res = await communityService.getThreadData(threadId!);
        setThreadData(res.thread);
        if (showLoading) setIsLoading(false);
    }

    useEffect(() => {
        fetchThreadData();
    }, []);

    const handleLike = () => {
        if (threadData?.id) {
            setIsLike(!isLike);
            setLikeCount(likeCount + (isLike ? -1 : 1));
            communityService.likeThread(threadData.id);
        }
    }

    const addComment = async (parentId?: string) => {
        const { error } = await communityService.addThreadComment(threadData?.id!, parentId ? replyComment : newComment, parentId);
        if (error) {
            enqueueSnackbar(error, {
                variant: 'error',
                action: (key) => (
                    <IconButton size="small" onClick={() => closeSnackbar(key)}>
                        <CloseOutlined />
                    </IconButton>
                ),
            });
        }
        else {
            setNewComment('');
            setReplyComment('');
            setShowReplyComment(null);
            fetchThreadData(false);
            return true;
        }
    }

    const CommentsComponent = () => {
        return (
            <Box my="24px">
                <Box mb="12px">
                    {threadData?.comments?.filter(e => !e.parentId).sort((a, b) => a.createdAt > b.createdAt ? 1 : -1).map((comment, index) => (
                        CommentComponent(comment, `${index}`)
                    ))}
                </Box>
                <CommentInput
                    placeholder='Write your reply...'
                    name='comment'
                    autoComplete='off'
                    value={newComment}
                    onChange={(e: any) => setNewComment(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                <SendIcon color="#8799A4" onClick={() => addComment()} style={{ cursor: 'pointer' }} />
                            </InputAdornment>
                        ),
                    }}
                    onKeyDown={(e: any) => {
                        if (e.keyCode === 13) {
                            addComment();
                        }
                    }}
                />
            </Box>
        );
    }

    const CommentComponent = (comment: ThreadComment, index: string) => {
        const replies = threadData?.comments?.filter(e => e.parentId === comment.id);

        const handleDeleteChat = async () => {
            const res = await communityService.deleteThreadComment(comment.id!);
            if (res.error) {
                enqueueSnackbar(res.error, {
                    variant: 'error',
                    action: (key) => (
                        <IconButton size="small" onClick={() => closeSnackbar(key)}>
                            <CloseOutlined />
                        </IconButton>
                    ),
                });
                return false;
            }
            enqueueSnackbar('Comment is deleted successfully', {
                variant: 'success',
                action: (key) => (
                    <IconButton size="small" onClick={() => closeSnackbar(key)}>
                        <CloseOutlined />
                    </IconButton>
                ),
            });
            fetchThreadData(false);
            return true;
        }

        return (
            <Box key={index}>
                <CommentAvatar>
                    <UserAvatar user={comment.user} />
                    <Typography fontWeight="600" fontSize="14px" mb="2px">
                        {comment.user?.fullName}
                    </Typography>
                </CommentAvatar>
                <CommentPane>
                    <Typography fontWeight="400" fontSize="14px">
                        {comment.comment}
                    </Typography>
                </CommentPane>
                <CommentToolbox>
                    <Box display='flex' alignItems='center' gap='12px'>
                        <Typography fontWeight="600" fontSize="14px">
                            {hummanizeDateDiff(comment.createdAt, new Date())} ago
                        </Typography>
                        <Typography fontWeight="400" fontSize="14px" style={{ cursor: "pointer" }} onClick={() => {
                            setShowReplyComment(comment.id);
                        }}>
                            Reply
                        </Typography>
                    </Box>
                    {comment.userId === user?.id && <Typography fontWeight="400" fontSize="14px" style={{ cursor: "pointer", color: "#EF476F" }} onClick={() => {
                        setShowDeleteComment(comment.id);
                    }}>
                        Delete
                        <ConfirmModal title="Confirm Delete" content="This data will be permanently deleted. Do you confirm that?" confirmText="Delete" open={showDeleteComment === comment.id} handleClose={() => setShowDeleteComment(null)} confirmIcon={<DeleteOutline style={{ marginRight: '4px' }} />} handleConfirm={handleDeleteChat} />
                    </Typography>}
                </CommentToolbox>
                {
                    showReplyComment === comment.id && (
                        <CommentInput
                            placeholder='Write your comment...'
                            name='comment'
                            autoComplete='off'
                            value={replyComment}
                            onChange={(e: any) => setReplyComment(e.target.value)}
                            autoFocus={true}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="start">
                                        <SendIcon color="#8799A4" onClick={() => addComment(comment.id ?? "")} style={{ cursor: 'pointer' }} />
                                    </InputAdornment>
                                ),
                            }}
                            onKeyDown={(e: any) => {
                                if (e.keyCode === 13) {
                                    addComment(comment.id ?? "");
                                }
                            }}
                        />
                    )
                }
                {
                    replies?.length ? (
                        <ReplyComponent>
                            {replies?.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1).map((reply, index) => (
                                CommentComponent(reply, `comment ${index}`)
                            ))}
                        </ReplyComponent>
                    ) : <></>
                }
            </Box>

        );
    }

    return (
        <RootStyle>
            <Header />
            {
                isLoading ? <LoadingPane>
                    <CircularProgress color="primary" style={{ margin: "auto" }} />
                </LoadingPane>
                    :
                    <Box>
                        <Typography fontSize={15} fontWeight={600} color="#26282C" marginTop="20px">{threadData?.title}</Typography>
                        <Typography fontSize={12} fontWeight={400} color="#56605FC5" textAlign="left" marginTop="6px" marginBottom="6px">{threadData?.subforum?.title}</Typography>
                        <ThreadContentBox>
                            <Box display="flex" justifyContent="start" alignItems="center" gap="12px">
                                <UserAvatar user={threadData?.user!} />
                                <Typography fontSize={14} fontWeight={700} color="#000000" textAlign="left">{threadData?.user?.fullName}</Typography>
                            </Box>
                            <ThreadContentText>
                                {threadData?.content}
                            </ThreadContentText>
                            <FileAttachmentPane>
                                <PinIcon />
                                {threadData?.link && <a href={process.env.REACT_APP_GATEWAY + threadData?.link} target="_blank" style={{ textDecoration: 'none' }} rel='noopener noreferrer' download>
                                    <Typography fontWeight="400" fontSize="14px" color="#8799A4">
                                        {threadData?.filename ?? ""}
                                    </Typography>
                                </a>}
                            </FileAttachmentPane>
                            <Box display='flex' alignItems='center' gap="8px">
                                <Box display="flex" alignItems="center" justifyContent="space-between" style={{ userSelect: "none" }}>
                                    {isLike ? <HeartIcon color="#EB5757" onClick={handleLike} /> : <HeartOutlineIcon color="#EB5757" onClick={handleLike} style={{ cursor: 'pointer' }} />}
                                    <Typography marginTop='1.5px'>
                                        {likeCount}
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" justifyContent="space-between" style={{ userSelect: "none" }}>
                                    <CommentsIcon />
                                    <Typography marginTop='1.5px'>
                                        {threadData?.comments?.length ?? 0}
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" justifyContent="space-between" style={{ userSelect: "none" }} gap='2px' marginLeft='1px' marginTop='2px'>
                                    <RemoveRedEyeOutlined style={{ color: '#56605FC5' }} />
                                    <Typography>
                                        {threadData?.comments?.length ?? 0}
                                    </Typography>
                                </Box>
                            </Box>
                        </ThreadContentBox>
                        {CommentsComponent()}
                    </Box>
            }
        </RootStyle >
    );
}

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
    padding: "24px 12px",
    margin: "0 auto",
    position: 'relative',
}));

const ReplyList = styled('div')(() => ({
    position: 'relative',
    border: '1px solid #E4E4E4',
    borderRadius: 12,
    padding: '8px',
    margin: '24px 0',
}));

const LoadingPane = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '50px 0',
}))

const ThreadContentBox = styled('div')(() => ({
    padding: '24px 0',
    borderTop: '2px solid #E4E4E4',
    borderBottom: '2px solid #E4E4E4',
    margin: '12px 0',
}))

const ThreadContentText = styled(Typography)(() => ({
    fontSize: 14,
    fontWeight: 400,
    color: '#282828',
    textAlign: 'left',
    padding: '12px 0',
}))

const CommentInput = styled(TextField)(({ theme }) => ({
    width: '100%',
    margin: '12px 0',
}))

const CommentAvatar = styled(Box)(({ theme }) => ({
    padding: '6px 0',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
}))

const CommentPane = styled(Box)(({ theme }) => ({
    padding: ' 4px 24px',
    whiteSpace: 'pre-line',
    wordBreak: 'break-word',
    borderLeft: '3px solid #E4E4E4',
    margin: '0 12px',
}))

const CommentToolbox = styled(Box)(({ theme }) => ({
    display: 'flex',
    itemAlign: 'center',
    gap: '12px',
    margin: '8px',
    justifyContent: 'space-between',
}))

const ReplyComponent = styled(Box)(({ theme }) => ({
    marginLeft: '16px',
    paddingLeft: '12px',
    marginBottom: '6px',
    marginTop: '6px',
}))

const FileAttachmentPane = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    marginBottom: 16,
}))
