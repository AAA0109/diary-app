import { useTranslation } from 'react-i18next';

import { Box, Button, CircularProgress, IconButton, TextField, Typography, styled } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
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
import { debounce } from 'lodash';
import CalendarIcon from 'components/icons/CalendarIcon';
import DateRangeModal from 'components/diary/dateRangeModal';


export default function AllDiaries() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { fetchDiaryList, loadingDiaryList } = useDiary();
    const [diaryList, setDiaryList] = useState<Diary[]>([]);
    const [isOpenFilterModal, setIsOpenFilterModal] = useState(false);
    const [sortBy, setSortBy] = useState<string>(SortByFilterList[0].id);
    const [searchKey, setSearchKey] = useState<string>("");
    const [topicFilter, setTopicFilter] = useState<string>("");
    const [showDateRangeModal, setShowDateRangeModal] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

    useEffect(() => {
        dispatch<any>(setHeaderTitle("All Diaries"));
        dispatch<any>(setNavigationStep(0));
    }, []);

    const updateDiaryList = async (showLoading?: boolean) => {
        setDiaryList(await fetchDiaryList({ sortBy, topicFilter, searchKey, startDate: dateRange[0], endDate: dateRange[1], withComments: true }, showLoading));
    }

    const handleFilter = (newSortBy: string, newTopicFilter: string) => {
        setSortBy(newSortBy);
        setTopicFilter(newTopicFilter);
    }

    useEffect(() => {
        updateDiaryList(true);
    }, [sortBy, topicFilter, searchKey, dateRange]);

    const handleSearchThread = (e: any) => {
        debounce(() => {
            setSearchKey(e.target.value);
        }, 1000)();
    }

    const handleShowDateRangeModal = () => {
        setShowDateRangeModal(true);
    }

    const handleCloseDateRangeModal = () => {
        setShowDateRangeModal(false);
    }

    const handleChangeDateRange = (dateRange: [Date | null, Date | null]) => {
        setDateRange(dateRange);
    }

    const dateFilterString = useCallback(() => {
        if (!dateRange[0] && !dateRange[1]) return "Date Filter";
        if (!dateRange[0]) return `before ${dateRange[1]?.toLocaleDateString()}`;
        if (!dateRange[1]) return `after ${dateRange[0]?.toLocaleDateString()}`;
        // show date range as YYYY-mm-dd format
        return `${dateRange[0]?.toLocaleDateString()} - ${dateRange[1]?.toLocaleDateString()}`;
    }, [dateRange]);

    return (
        <RootStyle>
            <Header beforeIcon={<></>} trailing={
                <FilterButton onClick={() => setIsOpenFilterModal(true)}>
                    <FilterIcon style={{ cursor: 'pointer' }} />
                </FilterButton>
            } />
            <SearchTextField
                color="primary"
                sx={{ width: "100%", margin: '16px 0' }}
                placeholder='Search for Diaries...'
                onKeyDown={(e) => handleSearchThread(e)}
                type="text"
            />
            <Box display='flex' justifyContent='end'>
                <DateRangeFilterGroup onClick={handleShowDateRangeModal}>
                    <CalendarIcon />
                    <Typography fontWeight={600}>
                        {dateFilterString()}
                    </Typography>
                </DateRangeFilterGroup>
                <DateRangeModal open={showDateRangeModal} handleClose={handleCloseDateRangeModal} handleDateRangeChange={handleChangeDateRange} startDate={dateRange[0]} endDate={dateRange[1]} />
            </Box>
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

const SearchTextField = styled(TextField)(() => ({
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

const DateRangeFilterGroup = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    background: '#f3f3f3',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.05)',
    borderRadius: '12px',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    marginBottom: '16px',
    '&:hover': {
        background: '#f5f5f5',
    },
}))
