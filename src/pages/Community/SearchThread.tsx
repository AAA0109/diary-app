import { useTranslation } from 'react-i18next';

import { Box, Button, CircularProgress, IconButton, TextField, Typography, styled } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
import { debounce } from 'lodash';
import { CommunityThread } from 'core/domain/community/thread';

const SortKeys = ['recent', 'views', 'replies', 'popularity'];

const communityService: ICommunityService = provider.get<ICommunityService>(SocialProviderTypes.CommunityService);

export default function SearchThread() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const { user } = useAuth();

    const [threadList, setThreadList] = useState<CommunityThread[]>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [sortBy, setSortBy] = useState<string>("recent");
    const [searchKey, setSearchKey] = useState<string>(searchParams.get('searchKey') ?? '');

    useEffect(() => {
        dispatch<any>(setHeaderTitle("Search Threads"));
        dispatch<any>(setNavigationStep(4));
    }, []);

    const fetchSearchResult = async () => {
        setIsLoading(true);
        const res = await communityService.searchThreads(searchKey);
        setThreadList(res.threads);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchSearchResult();
    }, [sortBy]);

    useEffect(() => {
        debounce(fetchSearchResult, 500)();
    }, [searchKey]);

    const handleChangeSearchKey = (e: any) => {
        setSearchKey(e.target.value);
    }

    return (
        <RootStyle>
            <Header />
            <SearchTextField
                color="primary"
                sx={{ width: "100%", marginTop: 2 }}
                placeholder='Search for Threads in  community'
                name='community-search'
                value={searchKey}
                onChange={handleChangeSearchKey}
                type="text"
            />
            <Typography fontSize={14} fontWeight={600} color="#26282C" textAlign="left" marginTop="20px" marginBottom="10px">Search Result ({threadList?.length ?? 0})</Typography>
            {
                isLoading ? <LoadingPane>
                    <CircularProgress color="primary" style={{ margin: "auto" }} />
                </LoadingPane>
                    :
                    (!threadList?.length ?
                        <Typography fontSize="30px" fontWeight="900" padding="50px 10px" color="rgba(0,0,0,0.6)" textAlign="center">No thread yet ...</Typography>
                        :
                        <ThreadList>
                            {threadList?.map((thread, index) => <ThreadItem key={index} thread={thread} />)}
                        </ThreadList>
                    )
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

const ThreadList = styled('div')(() => ({
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

const SearchTextField = styled(TextField)(() => ({
    '& input': {
        "&:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 100px #F5FAFC inset !important",
            WebkitTextFillColor: "default",
        },
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: 12,
        padding: "4px 12px",
        backgroundColor: '#fff !important',
        '& fieldset': {
            borderColor: '#E4E4E4 !important',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#469AD0 !important',
        },
        '&.Mui-focused svg': {
            color: "#469AD0 !important",
        },
    },
}));

const SortByFilterBox = styled(Box)(() => ({
    borderTop: '1px solid #E4E4E4',
    margin: '10px 0',
}))

const SortByFilterGroup = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    margin: '6px 0',
    marginBottom: '12px',
}))

const SortButton = styled(Button)(() => ({
    borderRadius: 12,
    padding: "2.5px 10px",
    fontSize: "12px",
    fontWeight: 500,
    color: "#808080",
    backgroundColor: "rgba(228, 228, 228, 0.50)",
    textTransform: 'uppercase',
    '&:hover': {
        backgroundColor: "rgba(228, 228, 228, 0.70)",
    },
    '&.active': {
        color: "#469AD0",
        backgroundColor: "rgba(70, 154, 208, 0.15)",
    }
}))

const AddNewThreadButton = styled(Button)(() => ({
    padding: "2.5px 10px",
    color: '#26282C',
    gap: '6px',
}))
