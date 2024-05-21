import { useTranslation } from 'react-i18next';

import { Box, Button, CircularProgress, IconButton, TextField, Typography, styled } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
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
import { PATH_MAIN } from 'routes/paths';
import { debounce } from 'lodash';

const communityService: ICommunityService = provider.get<ICommunityService>(SocialProviderTypes.CommunityService);

export default function CommunityHome() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [allForumList, setAllForumList] = useState<CommunityForum[]>([]);
    const [forumList, setForumList] = useState<CommunityForum[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isOpenFilterModal, setIsOpenFilterModal] = useState(false);
    const [forumFilter, setForumFilter] = useState<string[]>([]);

    useEffect(() => {
        dispatch<any>(setHeaderTitle("Community"));
        dispatch<any>(setNavigationStep(4));
    }, []);

    const fetchForumList = async () => {
        setIsLoading(true);
        const res = await communityService.getForumList(forumFilter);
        if(!forumFilter.length) {
            setAllForumList(res.forumList ?? []);
        }
        setForumList(res.forumList ?? []);
        setIsLoading(false);
    }

    const handleFilter = (newTopicFilter: string[]) => {
        setForumFilter(newTopicFilter);
    }

    useEffect(() => {
        fetchForumList();
    }, [forumFilter]);

    const goToSubforumPage = (subforumId: string) => {
        navigate(PATH_MAIN.community.subform(subforumId));
    }

    const handleSearchThread = (e: any) => {
        if (e.keyCode === 13) {
            navigate(PATH_MAIN.community.search(e.target.value));
        }
    }

    return (
        <RootStyle>
            <Header beforeIcon={<></>} trailing={
                <FilterButton onClick={() => setIsOpenFilterModal(true)}>
                    <FilterIcon style={{ cursor: 'pointer' }} />
                </FilterButton>
            } />
            <FilterForumsModal open={isOpenFilterModal} handleClose={() => setIsOpenFilterModal(false)} topicFilter={forumFilter} applyFilter={handleFilter} forums={allForumList} />
            <SearchTextField
                color="primary"
                sx={{ width: "100%", marginTop: 2 }}
                placeholder='Search for Threads in  community'
                onKeyDown={(e) => handleSearchThread(e)}
                type="text"
            />
            <Typography fontSize={14} fontWeight={600} color="#26282C" textAlign="left" marginTop="20px" marginBottom="10px">List Of Community Forums</Typography>
            <Typography fontSize={12} fontWeight={400} color="#56605FC5" textAlign="left" marginTop="10px" marginBottom="10px">List of Haru Hana Community Forums</Typography>
            {
                isLoading ? <LoadingPane>
                    <CircularProgress color="primary" style={{ margin: "auto" }} />
                </LoadingPane>
                    :
                    (forumList.length === 0 ?
                        <Typography fontSize="30px" fontWeight="900" padding="50px 10px" color="rgba(0,0,0,0.6)" textAlign="center">{forumFilter ? "No matching forum ..." : "No forum yet ..."}</Typography>
                        :
                        <ForumList>
                            {forumList.map((forum, index) => (
                                <ForumPanel key={index}>
                                    <ForumTitle>{forum.title}</ForumTitle>
                                    {forum.subforums.map((subforum, index) => (
                                        <SubformButton onClick={() => goToSubforumPage(subforum.id!)}>
                                            <CommunicationIcon />
                                            <Box>
                                                <SubformTitle>
                                                    {subforum.title}
                                                </SubformTitle>
                                                <SubformDescription>
                                                    {subforum.description}
                                                </SubformDescription>
                                            </Box>
                                        </SubformButton>
                                    ))}
                                </ForumPanel>
                            ))}
                        </ForumList>
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

const ForumList = styled('div')(() => ({
    position: 'relative',
}));

const LoadingPane = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '50px 0',
}))

const FilterButton = styled('div')(() => ({
    borderRadius: '12px',
    background: "#D9E7EF90",
    padding: '8px',
    width: '40px',
    height: '40px',
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

const ForumPanel = styled(Box)(() => ({
    border: '1px solid #E4E4E4',
    borderRadius: 12,
    padding: '18px 8px',
    margin: '24px 0',
}))

const ForumTitle = styled(Typography)(() => ({
    fontSize: '14px',
    fontWeight: 600,
    color: '#26282C',
    padding: '0 18px',
    paddingBottom: '12px',
    marginBottom: '8px',
    borderBottom: '1px solid #E4E4E4',
}))

const SubformButton = styled(Button)(() => ({
    width: '100%',
    padding: '12px',
    borderBottom: '1px solid #E4E4E4',
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'start',
    gap: '12px',
    borderRadius: 0,
}))

const SubformTitle = styled(Typography)(() => ({
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: 600,
    color: '#26282C',
}))

const SubformDescription = styled(Typography)(() => ({
    fontSize: '10px',
    fontWeight: 400,
    color: '#56605FC8',
}))