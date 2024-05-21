/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { createStyles, makeStyles, styled } from '@mui/styles';
import SvgImage from '@mui/icons-material/Image';
import { Box, Collapse, IconButton, InputAdornment, Menu, MenuItem, TextField, Typography } from '@mui/material';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IDiaryPaneComponentProps } from './IDiaryPaneComponentProps';
import EmotionChipComponent from 'components/emotionChip';
import { CloseOutlined, DeleteOutline, EditOutlined, MoreHoriz } from '@mui/icons-material';
import moment from 'moment';
import HeartOutlineIcon from 'components/icons/HeartOutlineIcon';
import ShareIcon from 'components/icons/ShareIcon';
import useDiary from 'hooks/useDiary';
import useAuth from 'hooks/useAuth';
import HeartIcon from 'components/icons/HeartIcon';
import { Link, useNavigate } from 'react-router-dom';
import { PATH_MAIN } from 'routes/paths';
import ConfirmDeleteModal from 'components/confirmDeleteModal';
import { useSnackbar } from 'notistack';
import CommentsIcon from 'components/icons/CommentsIcon';
import SendIcon from 'components/icons/SendIcon';
import { DiaryComment } from 'core/domain/diary/diaryComment';
import UserAvatar from 'components/UserAvatar';
import { hummanizeDateDiff } from 'utils/global';
import ConfirmModal from 'components/confirmModal';
import { IDiaryService } from 'core/services/diary/IDiaryService';
import { provider } from 'socialEngine';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import copy from 'copy-to-clipboard';

const diaryService: IDiaryService = provider.get<IDiaryService>(SocialProviderTypes.DiaryService);

export function SharedDiaryPaneComponent(props: IDiaryPaneComponentProps) {
    const { diary, style } = props;
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { t } = useTranslation();
    const [likeCount, setLikeCount] = useState(diary.likes?.length ?? 0);
    const [isExpanded, setIsExpanded] = useState(props.isExpand ?? false);
    const [newComment, setNewComment] = useState('');
    const [showReplyComment, setShowReplyComment] = useState<string | null>(null);
    const [replyComment, setReplyComment] = useState('');
    const [showDeleteComment, setShowDeleteComment] = useState<string | null>(null);
    const [showMoreBtn, setShowMoreBtn] = useState(false);
    const [showComments, setShowComments] = useState(!props.canExpand);
    const diaryContentRef = useRef(null);
    const navigate = useNavigate();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    /**
     * Will be called on loading image
     */
    const handleLoadImage = () => {
        setIsImageLoaded(true);
    };

    const handleClickSeeMore = () => {
        if (props.canExpand) {
            setIsExpanded(true);
        }
    }

    // const addComment = async (parentId?: string) => {
    //     const { error } = await diaryService.addDiaryComment(diary.id!, parentId ? replyComment : newComment, parentId);
    //     if (error) {
    //         enqueueSnackbar(error, {
    //             variant: 'error',
    //             action: (key) => (
    //                 <IconButton size="small" onClick={() => closeSnackbar(key)}>
    //                     <CloseIcon />
    //                 </IconButton>
    //             ),
    //         });
    //     }
    //     else {
    //         enqueueSnackbar('Comment is added successfully', {
    //             variant: 'success',
    //             action: (key) => (
    //                 <IconButton size="small" onClick={() => closeSnackbar(key)}>
    //                     <CloseIcon />
    //                 </IconButton>
    //             ),
    //         });
    //         setNewComment('');
    //         setReplyComment('');
    //         setShowReplyComment(null);
    //         props.updateDiary && props.updateDiary();
    //         return true;
    //     }
    // }

    const CommentsComponent = () => {
        return (
            <Box my="12px">
                <Box mb="12px">
                    {diary.comments?.filter(e => !e.parentId).sort((a, b) => a.createdAt > b.createdAt ? 1 : -1).map((comment, index) => (
                        CommentComponent(comment, `${index}`)
                    ))}
                </Box>
                <CommentInput
                    placeholder='Write your comment...'
                    name='comment'
                    autoComplete='off'
                    value={newComment}
                    onChange={(e: any) => setNewComment(e.target.value)}
                    disabled
                    // InputProps={{
                    //     endAdornment: (
                    //         <InputAdornment position="start">
                    //             <SendIcon color="#8799A4" onClick={() => addComment()} style={{ cursor: 'pointer' }} />
                    //         </InputAdornment>
                    //     ),
                    // }}
                    // onKeyDown={(e: any) => {
                    //     if (e.keyCode === 13) {
                    //         addComment();
                    //     }
                    // }}
                />
            </Box>
        );
    }

    useEffect(() => {
        if (diary.content) {
            const diaryRef: any = diaryContentRef.current;
            if (diary.imageUrl && diaryRef.scrollHeight > 45) {
                return setShowMoreBtn(true)
            }
            if (!diary.imageUrl && diaryRef.scrollHeight > 135) {
                return setShowMoreBtn(true)
            }
            setShowMoreBtn(false);
        }
    }, [diary])

    const handleToggleComments = () => {
        if (props.canExpand) {
            setShowComments(!showComments);
        }
    }

    const handleDeleteChat = async () => {
        const res = await diaryService.deleteDiaryComment(showDeleteComment!);
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
        props.updateDiary?.();
        return true;
    }

    const CommentComponent = (comment: DiaryComment, index: string) => {
        const replies = diary.comments?.filter(e => e.parentId === comment.id);

        return (
            <Box key={index}>
                <CommentAvatar>
                    <UserAvatar user={comment.user} />
                </CommentAvatar>
                <CommentPane>
                    <Typography fontWeight="600" fontSize="14px" mb="2px">
                        {comment.user?.fullName}
                    </Typography>
                    <Typography fontWeight="400" fontSize="14px" style={{ wordBreak: 'break-word' }}>
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
                            disabled
                            // InputProps={{
                            //     endAdornment: (
                            //         <InputAdornment position="start">
                            //             <SendIcon color="#8799A4" onClick={() => addComment(comment.id ?? "")} style={{ cursor: 'pointer' }} />
                            //         </InputAdornment>
                            //     ),
                            // }}
                            // onKeyDown={(e: any) => {
                            //     if (e.keyCode === 13) {
                            //         addComment(comment.id ?? "");
                            //     }
                            // }}
                        />
                    )
                }
                {
                    replies.length > 0 && (
                        <ReplyComponent>
                            {replies.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1).map((reply, index) => (
                                CommentComponent(reply, `comment ${index}`)
                            ))}
                        </ReplyComponent>
                    )
                }
            </Box>

        );
    }

    return (
        <Box className={`${classes.root} ${props.isFixedSize && classes.fixedSize}`}>
            <Box className={classes.header}>
                <EmotionChipComponent emotion={diary.diaryTopic?.name} />
            </Box>
            <Link to={PATH_MAIN.diary.viewDiary(diary.id!)} style={{ color: 'black' }}>
                <Typography fontWeight="600" fontSize="16px" style={{ wordBreak: 'break-word' }} sx={(isExpanded || props.canExpand) ? { wordBreak: 'break-word' } : { textOverflow: 'ellipsis', overflow: 'hidden', display: '-webkit-box', "-webkit-box-orient": 'vertical', "-webkit-line-clamp": '1', }}>
                    {diary.title ?? ""}
                </Typography>
            </Link>
            <Typography color="#56605FAA" fontWeight="400" fontSize="12px" paddingY="6px">
                {moment(diary.date).format('MMMM Do YYYY hh:mma')}
            </Typography>
            <Box height={isExpanded ? "100%" : (diary.imageUrl ? "70px" : "170px")} marginBottom={isExpanded ? "16px" : "8px"}>
                <Box ref={diaryContentRef} fontWeight="400" fontSize="15px" style={{ wordBreak: 'break-word' }} overflow="hidden" sx={isExpanded ? { wordBreak: 'break-word' } : { textOverflow: 'ellipsis', overflow: 'hidden', display: '-webkit-box', "-webkit-box-orient": 'vertical', "-webkit-line-clamp": diary.imageUrl ? '2' : '6', }}>
                    {diary.content}
                </Box>
                {!isExpanded && showMoreBtn && <Typography fontWeight="400" fontSize="12px" color="#469AD0" textAlign="right" style={{ cursor: "pointer" }} onClick={handleClickSeeMore}>
                    See more
                </Typography>}
            </Box>
            {diary.imageUrl &&
                <>
                    <img
                        alt={diary.imageUrl || ''}
                        className={classes.image}
                        // onClick={handleClick}
                        onLoad={handleLoadImage}
                        src={diary.imageUrl}
                        height={!props.isCarrousel ? "100%" : "100px"}
                        style={isImageLoaded ? style : { display: 'none' }}
                    />
                    <div
                        className={classNames(
                            classes.notLoadedRoot,
                            { [classes.noDisplay]: isImageLoaded },
                            { [classes.loading]: !isImageLoaded },
                        )}
                    >
                        <div className={classes.loadingContent}>
                            <SvgImage className={classes.loadingImage} />
                            <div>{t('image.notLoaded')}</div>
                        </div>
                    </div>
                </>
            }
            <Box display="flex" justifyContent="space-between" paddingY="10px">
                <Box display="flex" alignItems="center" justifyContent="space-between" gap="8px">
                    <Box display="flex" alignItems="center" justifyContent="space-between" style={{ userSelect: "none", cursor: 'pointer' }}>
                        <HeartOutlineIcon color="#EB5757" />
                        {likeCount}
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="space-between" style={{ userSelect: "none", cursor: 'pointer' }} onClick={handleToggleComments}>
                        <CommentsIcon />
                        {diary.commentCount ?? (diary.comments?.length ?? 0)}
                    </Box>
                    {/* <Box display="flex" alignItems="center" justifyContent="space-between">
                        <HeartOutlineIcon color="#EB5757" />
                        15
                    </Box> */}
                </Box>
            </Box>
            <Collapse in={showComments}>
                {props.showComments && CommentsComponent()}
            </Collapse>
        </Box>
    );
}

const CommentInput = styled(TextField)(({ theme }) => ({
    width: '100%',
    margin: '12px 0',
}))

const CommentAvatar = styled(Box)(({ theme }) => ({
    padding: '6px 0',
}))

const CommentPane = styled(Box)(({ theme }) => ({
    backgroundColor: '#F6FAFD',
    borderRadius: '16px',
    padding: '16px',
    whiteSpace: 'pre-line',
    wordBreak: 'break-word',
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
    borderLeft: '1px solid #E0E0E0',
    paddingLeft: '12px',
    marginBottom: '6px',
    marginTop: '6px',
}))

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            position: 'relative',
            backgroundColor: 'white',
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            borderRadius: '24px',
            padding: '24px',
            margin: '10px 0',
        },
        fixedSize: {
            width: '240px',
            minWidth: '240px',
            height: '350px',
            margin: '10px',
        },
        image: {
            verticalAlign: 'top',
            width: '100%',
            objectFit: 'cover',
            borderRadius: '16px',
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
        },
        loading: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100px',
            position: 'relative',
            color: '#cacecd',
            fontWeight: 400,
        },
        loadingContent: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        loadingImage: {
            fill: 'aliceblue',
            width: '50px',
            height: '50px',
        },
        noDisplay: {
            display: 'none',
        },
        notLoadedRoot: {
            backgroundColor: 'white',
        },
        diaryContent: {
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '100%',
            background: "white",
            boxShadow: "0 0 8px rgba(0,0,0,0.4)",
            borderRadius: '30px',
            padding: "10px 20px",
        },
        diaryTopic: {
            fontSize: '20px',
            fontWeight: 700,
            lineHeight: '1.6',
        },
        diaryDescription: {
            fontSize: '15px',
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#999',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '4px 0',
        },
    }),
);

export default SharedDiaryPaneComponent;
