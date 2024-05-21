/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { styled } from '@mui/styles';
import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IThreadItemComponentProps } from './IThreadItemComponentProps';
import moment from 'moment';
import HeartOutlineIcon from 'components/icons/HeartOutlineIcon';
import useDiary from 'hooks/useDiary';
import useAuth from 'hooks/useAuth';
import HeartIcon from 'components/icons/HeartIcon';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import CommunicationIcon from 'components/icons/CommunicationIcon';
import { ICommunityService } from 'core/services/community/ICommunityService';
import { provider } from 'socialEngine';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import CommentsIcon from 'components/icons/CommentsIcon';
import { RemoveRedEyeOutlined } from '@mui/icons-material';

const communityService: ICommunityService = provider.get<ICommunityService>(SocialProviderTypes.CommunityService);

export function ThreadItem(props: IThreadItemComponentProps) {
    const { thread, style } = props;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { t } = useTranslation();
    const { user } = useAuth();
    const [isLike, setIsLike] = useState((thread.likes?.findIndex(e => e.userId?.toString() === user?.id?.toString()) ?? -1) >= 0);
    const [likeCount, setLikeCount] = useState(thread.likes?.length ?? 0);
    const navigate = useNavigate();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleLike = () => {
        if (thread?.id) {
            setIsLike(!isLike);
            setLikeCount(likeCount + (isLike ? -1 : 1));
            communityService.likeThread(thread.id);
        }
    }

    return (
        <ForumPanel>
            <Box display='flex' alignItems='center' width='100%' gap="10px">
                <CommunicationIcon />
                <Link to={`/community/thread/${thread.id}`}>
                <ForumTitle>
                    {thread.title}
                    </ForumTitle>
                </Link>
            </Box>
            <ForumDescriptionBody>
                <ForumDescriptionText>
                    Started by {thread.user?.fullName}, {moment(thread.createdAt).format('DD/MM/YYYY hh:mm')}
                </ForumDescriptionText>
                <Box display='flex' alignItems='center' gap="4px" my="4px">
                    <Box display="flex" alignItems="center" justifyContent="space-between" style={{ userSelect: "none" }}>
                        {isLike ? <HeartIcon color="#EB5757" onClick={handleLike} /> : <HeartOutlineIcon color="#EB5757" onClick={handleLike} style={{ cursor: 'pointer' }} />}
                        <Typography marginTop='1.5px'>
                            {likeCount}
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="space-between" style={{ userSelect: "none" }}>
                        <CommentsIcon />
                        <Typography marginTop='1.5px'>
                            {thread.comments?.length ?? 0}
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="space-between" style={{ userSelect: "none" }} gap='2px' marginLeft='1px' marginTop='2px'>
                        <RemoveRedEyeOutlined style={{ color: '#56605FC5' }} />
                        <Typography>
                            {thread.comments?.length ?? 0}
                        </Typography>
                    </Box>
                </Box>
            </ForumDescriptionBody>
        </ForumPanel>
    );
}

const ForumPanel = styled(Box)(() => ({
    width: '100%',
    margin: '8px',
    padding: '8px 0',
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '1px solid #E4E4E4',
}))

const ForumTitle = styled(Typography)(() => ({
    flex: 1,
    fontSize: '14px',
    fontWeight: 600,
    color: '#26282C',
    margin: '2px 0',
    textAlign: 'left',
}))

const ForumDescriptionBody = styled(Box)(() => ({
    width: 'calc(100% - 32px)',
    margin: '4px 16px',
    padding: '0 20px',
    borderLeft: '3px solid #E4E4E4',
    color: '#26282C',
}))

const ForumDescriptionText = styled(Typography)(() => ({
    fontSize: '10px',
    fontWeight: 400,
    color: '#56605FC5',
    textAlign: 'left',
}))
export default ThreadItem;
