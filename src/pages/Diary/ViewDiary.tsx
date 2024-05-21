import { useTranslation } from 'react-i18next';

import { Box, CircularProgress, IconButton, TextField, Typography, styled } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import useDiary from 'hooks/useDiary';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import Header from 'components/header/Header';
import { useDispatch } from 'react-redux';
import { setHeaderTitle, setNavigationStep } from 'redux/actions/globalActions';
import { Diary } from 'core/domain/diary/diary';
import DiaryPaneComponent from 'components/diary/diaryPane';


export default function ViewDiary() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { fetchDiary, loadingDiary } = useDiary();
    const [diary, setDiary] = useState<Diary>(new Diary());
    const params = useParams();

    useEffect(() => {
        dispatch<any>(setHeaderTitle("View Diary"));
        dispatch<any>(setNavigationStep(0));
        getDiaryData(true);
    }, []);

    const getDiaryData = async (showLoading?: boolean) => {
        if (!params.diaryId) return;
        const { diary } = await fetchDiary(params.diaryId, showLoading);
        setDiary(diary);
    }

    const updateDiary = async () => {
        getDiaryData();
    }

    const updateDiaryList = async () => {
        navigate(-1);
    }


    return (
        <RootStyle>
            <Header />
            {
                loadingDiary ?
                    <LoadingPane>
                        <CircularProgress color="primary" style={{ margin: "auto" }} />
                    </LoadingPane> :
                    <DiaryPaneComponent diary={diary} updateDiaryList={updateDiaryList} updateDiary={updateDiary} canExpand={false} isExpand={true} showComments={true} />
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

const LoadingPane = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '50px 0',
}))