import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';

import classNames from 'classnames';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { Theme } from '@mui/material/styles/createTheme';
import { createStyles, makeStyles } from '@mui/styles';
import { Badge, Box, Button, Chip, CircularProgress, IconButton, LinearProgress, Menu, MenuItem, Select, TextField, Typography, circularProgressClasses, linearProgressClasses, styled } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import useDiary from 'hooks/useDiary';
import { Diary } from 'core/domain/diary/diary';
import { isToday } from 'utils/global';
import DiaryCarouselComponent from 'components/diary/diaryCarousel';
import MyAvatar from 'components/MyAvatar';
import useAuth from 'hooks/useAuth';
import BellIcon from 'components/icons/BellIcon';
import { AddCircleOutline, CloseOutlined, HdrPlusRounded, PlusOne } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import * as globalActions from 'redux/actions/globalActions';
import { EmotionList } from 'constants/emtionList';
import { globalSelector } from 'redux/reducers/global/globalSelector';
import ImageIcon from 'components/icons/ImageIcon';
import PlusRounded from 'components/icons/PlusRounded';
import { LoadingButton } from '@mui/lab';
import SelectTopicModal from 'components/diary/selectTopicModal';
import { useSnackbar } from 'notistack';
import { ICommonService } from 'core/services/common/ICommonService';
import { provider } from 'socialEngine';
import { SocialProviderTypes } from 'core/socialProviderTypes';
import EmotionChipComponent from 'components/emotionChip';
import ChevronDownIcon from 'components/icons/ChevronDownIcon';
import SettingsIcon from 'components/icons/SettingsIcon';
import { PATH_MAIN } from 'routes/paths';
import { IDiaryService } from 'core/services/diary/IDiaryService';
import { Notification } from 'core/domain/notifications/notification';
import { INotificationService } from 'core/services/notifications/INotificationService';

const selectEmotion = globalSelector.selectEmotion();

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

const PostPane = styled(Box)(({ theme }) => ({
    margin: '20px auto',
    position: 'relative',
    overflow: 'hidden',
    transition: "all .2s !important",
    '& *': {
        zIndex: 11,
        transition: "height .2s !important",
    }
}))

const BackdropPane = styled(Box)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#26282C70',
    zIndex: '10 !important',
    animation: '.3s ease-out 0s 1 fadeOpacity',
}));

const WhitePanel = styled(Box)(({ theme }) => ({
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '20px',
}))

const HR = styled('hr')(({ theme }) => ({
    borderColor: '#E4E4E460',
    borderWidth: '1px !important',
    outline: 'none !important',
    marginBottom: '12px',
    marginTop: '4px',
}))

const SelectCategory = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
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
    fontSize: '36px',
    padding: '6px',
    background: '#FFFFFFCC',
    borderRadius: '50%',
    cursor: 'pointer',
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

const commonService: ICommonService = provider.get<ICommonService>(SocialProviderTypes.CommonService);
const diaryService: IDiaryService = provider.get<IDiaryService>(SocialProviderTypes.DiaryService);
const notificationService: INotificationService = provider.get<INotificationService>(SocialProviderTypes.NotificationService);

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function DashboardPage() {
    const { t } = useTranslation();

    const query = useQuery();
    const isPostDiary = query.get('post');

    const classes = useStyles();
    const mdDownHidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { fetchDiaryList, topicList, selectedTopic, onClearSelection, notificationList, fetchNotificationList } = useDiary();
    const [diaryTitle, setDiaryTitle] = useState("");
    const [diaryContent, setDiaryContent] = useState("");
    const [diaryList, setDiaryList] = useState<Diary[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isPostingDiary, setIsPostingDiary] = useState(Boolean(isPostDiary));
    const [imageUrl, setImageUrl] = useState("");
    const [openTopicModal, setOpenTopicModal] = useState(false);

    const user = useAuth().user;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openNotification = Boolean(anchorEl);
    const handleNotificationClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleNotificationClose = () => {
        setAnchorEl(null);
    };

    const setNavigationStep = (step: number) => dispatch<any>(globalActions.setNavigationStep(step));

    const setEmotion = (emotion: string) => dispatch<any>(globalActions.setEmotion(emotion));
    const emotion = useSelector((state: any) => selectEmotion(state)) as string;

    const inputRef = useRef<HTMLInputElement>(null);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        setNavigationStep(2);
        updateDiaryList();
        fetchNotificationList();
    }, []);

    const updateDiaryList = async () => {
        setDiaryList(await fetchDiaryList({}, true));
    }

    const handleFileUpload = (event: any) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImageUrl(reader.result?.toString()!);
        };

        reader.readAsDataURL(file);
    };

    const handleClickUploadPanel = () => {
        inputRef.current?.click();
    }

    const removeSelectedFile = (event: any) => {
        if (inputRef.current?.value) {
            inputRef.current.value = "";
        }
        setImageUrl("");
    }

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
        if (imageUrl) {
            const res = await commonService.fileUpload(inputRef.current?.files?.[0]!);
            uploadImgUrl = process.env.REACT_APP_GATEWAY + res.url;
        }
        const { error } = await diaryService.postDiary({
            title: diaryTitle,
            content: diaryContent,
            imageUrl: uploadImgUrl,
            date: new Date(),
            topicId: selectedTopic,
        });

        if (!error) {
            setImageUrl("");
            setDiaryContent("");
            onClearSelection();
            setIsPostingDiary(false);
            updateDiaryList();
        }
        setIsLoading(false);
    }

    const handleChangeEmotion = (event: any) => {
        setEmotion(event.target.value as string);
    }

    const selectedTopicData = topicList.find(e => e.id?.toString() === selectedTopic?.toString());

    const handleCancelPosting = () => {
        setImageUrl("");
        setDiaryContent("");
        onClearSelection();
        setIsPostingDiary(false);
    }

    const handleClickNotificationItem = async (notification: Notification) => {
        await notificationService.setSeenNotification(notification.id!);
        if (notification.url) navigate(notification.url);
        handleNotificationClose();
    }

    const handleClickViewAllNotification = async () => {
        await notificationService.setSeenAllNotifications();
    }

    return (
        <Box className={classNames(classes.gridItem, classes.root)}>
            <Box className={classes.welcomePane}>
                <Box className={classes.avatarPane}>
                    <MyAvatar size={32} className={classes.avatar} />
                    <Box className={classes.userPane}>
                        <Typography fontSize="20px" fontWeight="600">{user?.fullName}</Typography>
                        {/* <SelectBox
                            value={emotion}
                            onChange={handleChangeEmotion}
                            IconComponent={(props: JSX.IntrinsicAttributes & { [x: string]: any; }) => {
                                return (
                                    <ChevronDownIcon {...props} style={{ right: 16, top: "calc(50% - 10px)" }} />
                                );
                            }}
                        >
                            {EmotionList.map((item) => (
                                <MenuItem value={item.key} key={item.key}>{item.text}</MenuItem>
                            ))}
                        </SelectBox> */}
                    </Box>
                </Box>
                <Box display="flex" gap="12px">
                    <Button
                        id="basic-button"
                        aria-controls={openNotification ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openNotification ? 'true' : undefined}
                        className={classes.notificationIcon}
                        onClick={handleNotificationClick}
                    >
                        <Badge color="error" variant="dot" invisible={!notificationList.length} className={classes.notificationMark}>
                            <BellIcon />
                        </Badge>
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={openNotification}
                        onClose={handleNotificationClose}
                        className={classes.notificationPane}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleClickViewAllNotification} className={classes.notificationItem} style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white', display: 'flex', justifyContent: 'center', borderBottom: '1px solid #eee' }}>
                            <Typography fontSize="12px" fontWeight="600" color="#0F344A">
                                VIEW ALL
                            </Typography>
                        </MenuItem>
                        {notificationList.map(notification => (
                            <MenuItem onClick={() => handleClickNotificationItem(notification)} className={classes.notificationItem}>
                                <Typography fontSize="14px" fontWeight="500" color="#0F344A" whiteSpace='pre-wrap'>
                                    <div dangerouslySetInnerHTML={{ __html: notification.content ?? "" }} />
                                </Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                    <SettingsIcon onClick={() => navigate(PATH_MAIN.user.account)} color="#444" className={classes.notificationIcon} />
                </Box>
            </Box>
            <PostPane height={isPostingDiary ? ((imageUrl) ? 435 : 335) : 58}>
                {isPostingDiary ? (
                    <>
                        <BackdropPane />
                        <WhitePanel>
                            <PostTextField
                                onChange={(e) => { setDiaryTitle(e.target.value); }}
                                style={{ marginBottom: '24px' }}
                                placeholder='Type title here'
                            />
                            <PostTextField
                                multiline
                                onChange={(e) => { setDiaryContent(e.target.value); }}
                                rows={4}
                                placeholder='What would you like to write?'
                            />
                            <HR />
                            {(imageUrl) ? (
                                <DiaryImagePane>
                                    <DiaryImage src={imageUrl ?? ''} alt="diary" />
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
                                <ImageIcon onClick={handleClickUploadPanel} style={{ cursor: 'pointer' }} />
                            </Box>
                        </WhitePanel>
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
                            Post Diary
                        </PostButton>
                        <CloseIcon onClick={handleCancelPosting} />
                    </>
                ) : (
                    <Box className={classes.postDiary} onClick={() => setIsPostingDiary(true)}>
                        {t('home.postDiary')}
                        <AddCircleOutline />
                    </Box>
                )}
            </PostPane>
            <SelectTopicModal open={openTopicModal} handleClose={() => setOpenTopicModal(false)} />

            {/* <Box className={classes.progressPane}>
                    <Typography className={classes.progressMention}>
                        {75}{t('home.progressMention')}
                    </Typography>
                    <BorderLinearProgress variant="determinate" value={75} />
                </Box> */}
            <Box className={classes.todayDiaryPane} style={{ marginTop: "40px" }}>
                <Typography variant='h5'>
                    {t("home.recentDiary")}
                </Typography>
                <Box className={classes.diaryList}>
                    <DiaryCarouselComponent diaryList={diaryList} updateDiaryList={updateDiaryList} />
                </Box>
            </Box>
        </Box>
    );
}

// ----------------------------------------------------------------------

const SelectBox = styled(Select)(() => ({
    width: "100%",
    '& .MuiSelect-select': {
        padding: "0",
    },
    '& fieldset': {
        border: 'none',
    },
    '& svg': {
        right: '8px !important',
        top: 'calc(50% - 6px)',
        width: '20px !important',
        height: '20px !important',
    },
}));

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: '0 12px',
        },
        gridItem: {
            padding: '24px 0 !important',
        },
        postGrid: {
            width: '100%',
        },
        todayDiaryPane: {
            margin: '20px 0',
        },
        diaryList: {
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            margin: '24px 0',
            marginBottom: '30px',
        },
        postDiary: {
            border: '1px dashed #999',
            borderRadius: '12px',
            color: '#555',
            fontSize: '14px',
            padding: '16px',
            userSelect: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: "8px",
            cursor: "pointer",
            transition: "all .3s",
            width: "100%",
        },
        progressPane: {
            backgroundColor: "white",
            padding: "25px",
            marginTop: "40px",
            borderRadius: "12px",
            boxShadow: "0 1px 4px 0 rgba(0,0,0,0.14)",
            [theme.breakpoints.down('md')]: {
                padding: "15px",
                marginTop: "30px",
            },
            minHeight: "70px",
        },
        progressMention: {
            margin: '10px 0',
            color: "#999",
            paddingTop: "20px",
        },
        welcomePane: {
            padding: "20px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },
        avatarPane: {
            display: 'flex',
            alignItems: 'center',
        },
        avatar: {
            margin: 5,
        },
        userPane: {
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            margin: 8,
        },
        notificationIcon: {
            width: "24px",
            height: "24px",
            cursor: "pointer",
            minWidth: "24px",
            maxWidth: "24px",
        },
        notificationPane: {
            '& .MuiPaper-root': {
                height: '300px',
                minWidth: "300px",
                maxWidth: "450px",

                '&::-webkit-scrollbar': {
                    width: '6px',
                    height: '6px',
                },
                '&::-webkit-scrollbar-track': {
                    borderRadius: '10px',
                    background: 'rgba(0,0,0,0.1)',
                },
                '&::-webkit-scrollbar-thumb': {
                    borderRadius: '10px',
                    background: 'rgba(0,0,0,0.2)',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: 'rgba(0,0,0,0.4)',
                },
                '&::-webkit-scrollbar-thumb:active': {
                    background: 'rgba(0,0,0,.9)',
                },
            }
        },
        notificationItem: {
            minWidth: "300px",
            maxWidth: "450px",
            padding: '12px 24px',
        },
        notificationMark: {
            "& .MuiBadge-badge.MuiBadge-dot": {
                right: "6px",
                top: "3px",
            },
        },
        username: {
            color: "#999",
            fontSize: "16px",
        }
    }),
);
