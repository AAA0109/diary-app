import { useTranslation } from 'react-i18next';

import { Box, IconButton, TextField, Typography, styled } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import useDiary from 'hooks/useDiary';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { useNavigate, useParams } from 'react-router-dom';
import EmotionChipComponent from 'components/emotionChip';
import { CloseOutlined } from '@mui/icons-material';
import PlusRounded from 'components/icons/PlusRounded';
import ImageIcon from 'components/icons/ImageIcon';
import Header from 'components/header/Header';
import { useDispatch } from 'react-redux';
import { setHeaderTitle } from 'redux/actions/globalActions';
import { ICommonService } from 'core/services/common/ICommonService';
import { provider } from 'socialEngine';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import SelectTopicModal from 'components/diary/selectTopicModal';
import { IDiaryService } from 'core/services/diary/IDiaryService';

const commonService: ICommonService = provider.get<ICommonService>(SocialProviderTypes.CommonService);
const diaryService: IDiaryService = provider.get<IDiaryService>(SocialProviderTypes.DiaryService);

export default function EditDiary() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [diaryContent, setDiaryContent] = useState("");
    const [diaryTitle, setDiaryTitle] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [openTopicModal, setOpenTopicModal] = useState(false);
    const { topicList, selectedTopic, onSelectTopic, onClearSelection, fetchDiary } = useDiary();
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams()

    const handleClickUploadPanel = () => {
        inputRef.current?.click();
    }

    const removeSelectedFile = (event: any) => {
        if (inputRef.current?.value) {
            inputRef.current.value = "";
        }
        setImageUrl("");
    }

    const handleFileUpload = (event: any) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImageUrl(reader.result?.toString()!);
        };

        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        if (!diaryContent.length) {
            setIsLoading(false);
            enqueueSnackbar("Please enter a diary content", {
                variant: 'error',
                action: (key) => (
                    <IconButton size="small" onClick={() => closeSnackbar(key)}>
                        <CloseIcon />
                    </IconButton>
                ),
            });
            return;
        }
        if (!selectedTopic) {
            setIsLoading(false);
            enqueueSnackbar("Please select a category", {
                variant: 'error',
                action: (key) => (
                    <IconButton size="small" onClick={() => closeSnackbar(key)}>
                        <CloseIcon />
                    </IconButton>
                ),
            });
            return;
        }
        let uploadImgUrl = null;
        if (imageUrl && imageUrl.startsWith('http://') && imageUrl.startsWith('https://')) {
            const res = await commonService.fileUpload(inputRef.current?.files?.[0]!);
            uploadImgUrl = process.env.REACT_APP_GATEWAY + res.url;
        }
        const { error } = await diaryService.editDiary({
            id: params.diaryId,
            title: diaryTitle,
            content: diaryContent,
            imageUrl: uploadImgUrl,
            topicId: selectedTopic,
        });
        if (!error) {
            enqueueSnackbar("Diary is updated successfully.", {
                variant: 'success',
                action: (key) => (
                    <IconButton size="small" onClick={() => closeSnackbar(key)}>
                        <CloseIcon />
                    </IconButton>
                ),
            });
        }
        setIsLoading(false);
    }

    useEffect(() => {
        dispatch<any>(setHeaderTitle("Edit Diary"));
        (async () => {
            if (params.diaryId) {
                const { diary } = await fetchDiary(params.diaryId);
                if (diary) {
                    setDiaryContent(diary.content ?? "");
                    setDiaryTitle(diary.title ?? "");
                    onSelectTopic(diary.diaryTopic?.id ?? "");
                    if (diary.imageUrl.startsWith('http://') || diary.imageUrl.startsWith('https://')) {
                        setImageUrl(diary.imageUrl || "");
                    }
                }
                else {
                    navigate(-1);
                    enqueueSnackbar("Diary doesn't exist.", {
                        variant: 'error',
                        action: (key) => (
                            <IconButton size="small" onClick={() => closeSnackbar(key)}>
                                <CloseIcon />
                            </IconButton>
                        ),
                    });
                }
            }
        })();
        return () => {
            setImageUrl("");
            setDiaryContent("");
            onClearSelection();
        }
    }, []);

    const selectedTopicData = topicList.find(e => e.id?.toString() === selectedTopic?.toString());

    return (
        <RootStyle>
            <Header />
            <EditPane>
                <PostTextField
                    onChange={(e) => { setDiaryTitle(e.target.value); }}
                    style={{ marginBottom: '24px' }}
                    value={diaryTitle}
                    placeholder='Type title here'
                />
                <PostTextField
                    multiline
                    onChange={(e) => { setDiaryContent(e.target.value); }}
                    rows={4}
                    value={diaryContent}
                    placeholder='What would you like to write?'
                />
                <HR />
                {(imageUrl) ? (
                    <DiaryImagePane>
                        <DiaryImage src={imageUrl} alt="diary" />
                        {imageUrl && <RemoveImageIcon onClick={removeSelectedFile} />}
                    </DiaryImagePane>
                ) : null}
                <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="12px">
                    {selectedTopicData ? (
                        <EmotionChipComponent emotion={selectedTopicData.name} onDelete={onClearSelection} />
                    ) : (
                        <SelectCategory onClick={() => setOpenTopicModal(true)}>
                            <PlusIcon color="#469AD0" />
                            <Typography fontSize="14px" fontWeight="500" color="#0F344A">
                                Select Category
                            </Typography>
                            <Typography color="#469AD0" paddingX="2px">
                                *
                            </Typography>
                        </SelectCategory>
                    )
                    }
                    <ImageIcon onClick={handleClickUploadPanel} />
                </Box>
            </EditPane>
            <input
                ref={inputRef}
                id="upload-image"
                hidden
                accept=".jpg, .jpeg, .png"
                type="file"
                onChange={handleFileUpload}
            />
            <PostButton
                tabIndex={3}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isLoading}
                onClick={handleSubmit}
            >
                Save Diary
            </PostButton>
            <SelectTopicModal open={openTopicModal} handleClose={() => setOpenTopicModal(false)} />
        </RootStyle>
    );
}

// ----------------------------------------------------------------------

const PostTextField = styled(TextField)(() => ({
    width: "100%",
    lineHeight: "1.5",
    '& textarea': {
        color: "#56605F90",
        zIndex: 2,
        "&:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 100px #F5FAFC inset !important",
            WebkitTextFillColor: "default",
        },
    },
    '& input': {
        padding: '0 !important',
    },
    '& svg': {
        pointerEvents: "none",
    },
    '& .MuiOutlinedInput-root': {
        padding: 0,
        '& fieldset': {
            borderColor: 'transparent !important',
        },
    },
}));

const RootStyle = styled('div')(() => ({
    padding: "24px 12px",
    margin: "0 auto",
    position: 'relative',
}));

const EditPane = styled(Box)(({ theme }) => ({
    marginTop: "30px",
    border: "1px solid #E4E4E4",
    borderRadius: "12px",
    padding: "24px",
}))

const DiaryImagePane = styled(Box)(({ theme }) => ({
    height: '90px',
    width: '180px',
    margin: 'auto',
    position: 'relative',
}))

const DiaryImage = styled('img')(({ theme }) => ({
    height: '90px',
    width: '180px',
    objectFit: 'cover',
    borderRadius: '16px',
}))

const HR = styled('hr')(({ theme }) => ({
    borderColor: '#E4E4E460',
    borderWidth: '1px !important',
    outline: 'none !important',
    marginBottom: '12px',
    marginTop: '4px',
}))

const RemoveImageIcon = styled(CloseOutlined)(({ theme }) => ({
    position: 'absolute',
    top: '6px',
    right: '6px',
    color: 'black',
    fontSize: '24px',
    background: '#FFFFFFCC',
    cursor: 'pointer',
    borderRadius: '50%',
}))

const PlusIcon = styled(PlusRounded)(({ theme }) => ({
    marginRight: '6px',
}))

const CloseIcon = styled(CloseOutlined)(({ theme }) => ({
    position: 'fixed',
    top: '20px',
    right: '20px',
    color: 'black',
    fontSize: '24px',
    background: '#FFFFFFCC',
    borderRadius: '50%',
}))

const PostButton = styled(LoadingButton)(({ theme }) => ({
    padding: "16px 0",
    margin: "24px 0",
    fontSize: "18px",
    fontWeight: 700,
    borderRadius: 18,
    fontFamily: 'Montserrat',
    '&.MuiLoadingButton-loading': {
        position: 'initial',
        backgroundColor: '#469AD088',
    }
}))

const SelectCategory = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
}))