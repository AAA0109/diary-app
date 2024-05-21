import { useTranslation } from 'react-i18next';

import { Box, Button, CircularProgress, IconButton, TextField, Typography, styled } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import useDiary from 'hooks/useDiary';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import Header from 'components/header/Header';
import { useDispatch } from 'react-redux';
import { setHeaderTitle, setNavigationStep } from 'redux/actions/globalActions';
import { Diary } from 'core/domain/diary/diary';
import DiaryPaneComponent from 'components/diary/diaryPane';
import FilterIcon from 'components/icons/FilterIcon';
import FilterDiariesModal from 'components/diary/filterDiariesModal';
import { SortByFilterList } from 'constants/sortByFilterList';
import useAuth from 'hooks/useAuth';
import UserAvatar from 'components/UserAvatar';
import { EmotionList } from 'constants/emtionList';
import { IDiaryService } from 'core/services/diary/IDiaryService';
import { provider } from 'socialEngine';
import { SocialProviderTypes } from 'core/socialProviderTypes';

const diaryService: IDiaryService = provider.get<IDiaryService>(SocialProviderTypes.DiaryService);

export default function FamilyDiaries() {
    const { t } = useTranslation();
    const { userId } = useParams();
    const { user } = useAuth();
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [loadingDiaryList, setLoadingDiaryList] = useState(true);
    const [diaryList, setDiaryList] = useState<Diary[]>([]);
    const [isOpenFilterModal, setIsOpenFilterModal] = useState(false);
    const [sortBy, setSortBy] = useState<string>(SortByFilterList[0].id);
    const [topicFilter, setTopicFilter] = useState<string>("");

    const member = user?.family?.members?.find(member => member.id?.toString() === userId);

    useEffect(() => {
        dispatch<any>(setNavigationStep(1));
        if (!userId || !member) {
            enqueueSnackbar('Access Denied', { variant: 'warning' });
            navigate('/404');
        }
    }, []);

    const updateDiaryList = async (showLoading?: boolean) => {
        if (showLoading) {
            setLoadingDiaryList(true);
        }
        const { diaryList } = await diaryService.getFamilyDiaryList({ sortBy, topicFilter, withComments: true, userId: userId! })
        setDiaryList(diaryList);
        setLoadingDiaryList(false);
    }

    const handleFilter = (newSortBy: string, newTopicFilter: string) => {
        setSortBy(newSortBy);
        setTopicFilter(newTopicFilter);
    }

    useEffect(() => {
        updateDiaryList(true);
    }, [sortBy, topicFilter]);

    return (
        <RootStyle>
            <Header child={
                <Box display="flex" gap="12px" alignItems="center" marginLeft="6px">
                    <UserAvatar user={member!} />
                    <Box>
                        <MemberName>{member?.fullName}</MemberName>
                        <MemberEmotion>{EmotionList.find((emotion) => emotion.key === member?.currentEmotion!)?.text}</MemberEmotion>
                    </Box>
                </Box>
            } trailing={
                <FilterButton onClick={() => setIsOpenFilterModal(true)}>
                    <FilterIcon style={{ cursor: 'pointer' }} />
                </FilterButton>
            } />
            <FilterDiariesModal open={isOpenFilterModal} handleClose={() => setIsOpenFilterModal(false)} sortBy={sortBy} topicFilter={topicFilter} applyFilter={handleFilter} />
            {
                loadingDiaryList ? <LoadingPane>
                    <CircularProgress color="primary" style={{ margin: "auto" }} />
                </LoadingPane>
                    :
                    (diaryList.length === 0 ?
                        <Typography fontSize="30px" fontWeight="900" padding="50px 10px" color="rgba(0,0,0,0.6)" textAlign="center">{topicFilter ? "No matching diary ..." : "No diary yet ..."}</Typography>
                        :
                        <DiaryList>
                            {diaryList.map((diary, index) => <DiaryPaneComponent key={index} diary={diary} updateDiaryList={updateDiaryList} updateDiary={updateDiaryList} canExpand={true} isExpand={false} showComments={true} />)}
                        </DiaryList>
                    )
            }
        </RootStyle>
    );
}

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
    padding: "24px 12px",
    margin: "0 auto",
    position: 'relative',
}));

const DiaryList = styled('div')(() => ({
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

const MemberName = styled(Typography)(() => ({
    fontSize: 18,
    fontWeight: 600,
    color: "#26282C",
}))

const MemberEmotion = styled(Typography)(() => ({
    fontSize: '12px',
    fontWeight: 400,
    color: '#797C7B',
    textAlign: 'left',
}))
