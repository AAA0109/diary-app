import React, { useEffect, useState } from "react";
import { CloseOutlined, DeleteOutline, MoreHoriz } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, CircularProgress, Collapse, IconButton, InputAdornment, Menu, MenuItem, TextField, Typography, styled } from "@mui/material";
import MottoIcon from "components/icons/MottoIcon";
import useAuth from "hooks/useAuth";
import { FamilyMoto } from "core/domain/family/familyMoto";
import CreateFamilyMoto from "./createFamilyMoto";
import CommentsIcon from "components/icons/CommentsIcon";
import SendIcon from "components/icons/SendIcon";
import { FamilyMotoComment } from "core/domain/family/fanilyMotoComment";
import UserAvatar from "components/UserAvatar";
import { hummanizeDateDiff } from "utils/global";
import { useSnackbar } from "notistack";
import EditFamilyMoto from "./editFamilyMoto";
import ConfirmModal from "components/confirmModal";
import { useNavigate } from "react-router";
import { PATH_MAIN } from "routes/paths";

export function FamilyMotoPane({ ...props }) {

    const [mottoMenuAnchorEl, setMottoMenuAnchorEl] = useState<null | HTMLElement>(null);
    const mottoMenuOpen = Boolean(mottoMenuAnchorEl);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const navigator = useNavigate();

    const { user, getCurrentFamilyMoto, addFamilyMotoComment, archieveFamilyMoto, deleteFamilyMoto, deleteFamilyMotoComment } = useAuth();
    const [currentMoto, setCurrentMoto] = useState<null | FamilyMoto>(null);
    const [isMotoLoading, setIsMotoLoading] = useState(true);
    const [isCreateMotoOpen, setIsCreateMotoOpen] = useState(false);
    const [isEditMotoOpen, setIsEditMotoOpen] = useState(false);
    const [isArchieveMotoOpen, setIsArchieveMotoOpen] = useState(false);
    const [isDeleteMotoOpen, setIsDeleteMotoOpen] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [showReplyComment, setShowReplyComment] = useState<string | null>(null);
    const [showDeleteComment, setShowDeleteComment] = useState<string | null>(null);
    const [replyComment, setReplyComment] = useState('');

    const handleMottoMoreClick = (event: React.MouseEvent<HTMLElement>) => {
        setMottoMenuAnchorEl(event.currentTarget);
    };

    const handleMottoMenuClose = () => {
        setMottoMenuAnchorEl(null);
    };

    useEffect(() => {
        fetchCurrentMoto();
    }, []);

    const fetchCurrentMoto = async () => {
        setIsMotoLoading(true);
        const { currentMoto } = await getCurrentFamilyMoto();
        setIsMotoLoading(false);
        setCurrentMoto(currentMoto);
    }

    const updateCurrentMotot = () => {
        fetchCurrentMoto();
    }

    const addComment = async (parentId?: string) => {
        const { error } = await addFamilyMotoComment(currentMoto?.id!, parentId ? replyComment : newComment, parentId);
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
            enqueueSnackbar('Comment is added successfully', {
                variant: 'success',
                action: (key) => (
                    <IconButton size="small" onClick={() => closeSnackbar(key)}>
                        <CloseOutlined />
                    </IconButton>
                ),
            });
            setNewComment('');
            setReplyComment('');
            setShowReplyComment(null);
            fetchCurrentMoto();
            return true;
        }
    }

    const CommentsComponent = () => {
        return (
            <Box my="12px" bgcolor='white' padding='12px' borderRadius='8px'>
                <Box mb="12px">
                    {currentMoto?.comments?.filter(e => !e.parentId).sort((a, b) => a.createdAt > b.createdAt ? 1 : -1).map((comment, index) => (
                        CommentComponent(comment, `${index}`)
                    ))}
                </Box>
                <CommentInput
                    placeholder='Write your comment...'
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

    const CommentComponent = (comment: FamilyMotoComment, index: string) => {
        const replies = currentMoto?.comments?.filter(e => e.parentId === comment.id);

        const handleDeleteChat = async () => {
            const res = await deleteFamilyMotoComment(comment.id!);
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
            fetchCurrentMoto();
            return true;
        }

        return (
            <Box key={index}>
                <CommentAvatar>
                    <UserAvatar user={comment.user} />
                </CommentAvatar>
                <CommentPane>
                    <Typography fontWeight="600" fontSize="14px" mb="2px">
                        {comment.user?.fullName}
                    </Typography>
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
                            {replies.sort((a, b) => a.createdAt > b.createdAt ? 1 : -1).map((reply, index) => (
                                CommentComponent(reply, `comment ${index}`)
                            ))}
                        </ReplyComponent>
                    ) : <></>
                }
            </Box>

        );
    }

    const handleShowComments = () => {
        setShowComments(!showComments);
    }

    const handleEditMoto = () => {
        setIsEditMotoOpen(true);
        handleMottoMenuClose();
    }

    const handleConfirmArchieve = () => {
        setIsArchieveMotoOpen(true);
        handleMottoMenuClose();
    }

    const handleConfirmDelete = () => {
        setIsDeleteMotoOpen(true);
        handleMottoMenuClose();
    }

    const handleArchieveMoto = async () => {
        const res = await archieveFamilyMoto(currentMoto?.id!);
        enqueueSnackbar('Moto is archieved successfully', {
            variant: 'success',
            action: (key) => (
                <IconButton size="small" onClick={() => closeSnackbar(key)}>
                    <CloseOutlined />
                </IconButton>
            ),
        });
        fetchCurrentMoto();
        return true;
    }

    const handleDeleteMoto = async () => {
        const res = await deleteFamilyMoto(currentMoto?.id!);
        enqueueSnackbar('Moto is removed successfully', {
            variant: 'success',
            action: (key) => (
                <IconButton size="small" onClick={() => closeSnackbar(key)}>
                    <CloseOutlined />
                </IconButton>
            ),
        });
        fetchCurrentMoto();
        return true;
    }

    const goToAllMotosPage = () => {
        navigator(PATH_MAIN.family.motos)
    }

    return !isMotoLoading ? <RootStyle>
        <ToolbarStyle>
            <MottoIcon />
            <Box>
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={mottoMenuOpen ? 'long-menu' : undefined}
                    aria-expanded={mottoMenuOpen ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleMottoMoreClick}
                >
                    <MoreHoriz />
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    anchorEl={mottoMenuAnchorEl}
                    open={mottoMenuOpen}
                    onClose={handleMottoMenuClose}
                    PaperProps={{
                        style: {
                            width: '20ch',
                        },
                    }}
                >
                    {currentMoto && props.canEdit && <MenuItem onClick={handleEditMoto}>
                        Edit
                    </MenuItem>}
                    <MenuItem onClick={goToAllMotosPage}>
                        View All
                    </MenuItem>
                    {currentMoto && props.canEdit && <MenuItem onClick={handleConfirmArchieve}>
                        Archieve
                    </MenuItem>}
                    {props.canEdit && <MenuItem onClick={handleConfirmDelete} style={{ color: 'rgb(239, 71, 111)' }}>
                        Remove
                    </MenuItem>}
                </Menu>
            </Box>
        </ToolbarStyle>
        <MotoPane>
            <NewMotoTitle>
                {currentMoto ? 'Family Current Goal' : 'New Goal'}
            </NewMotoTitle>
            <MotoTitle>
                {currentMoto ? currentMoto.name : 'Lets Create New Family goal'}
            </MotoTitle>
            {currentMoto && <MotoDescription>
                {currentMoto.description}
            </MotoDescription>}
            {!currentMoto && <WrapperButtonStyle>
                <LoadingButton
                    tabIndex={3}
                    fullWidth
                    size="large"
                    onClick={() => setIsCreateMotoOpen(true)}
                    variant="contained"
                    style={{ padding: "16px 0", fontSize: "18px", fontWeight: 700, borderRadius: 18, fontFamily: 'Montserrat', }}
                >
                    Create New Goal
                </LoadingButton>
            </WrapperButtonStyle>}
            <CreateFamilyMoto open={isCreateMotoOpen} handleClose={() => setIsCreateMotoOpen(false)} updateCurrentMoto={updateCurrentMotot} />
            {currentMoto && <EditFamilyMoto open={isEditMotoOpen} moto={currentMoto} handleClose={() => setIsEditMotoOpen(false)} updateCurrentMoto={updateCurrentMotot} />}
            <ConfirmModal title="Archive Moto" content="Are you sure you want to archive this moto?" confirmText="Archive" open={isArchieveMotoOpen} handleClose={() => setIsArchieveMotoOpen(false)} handleConfirm={handleArchieveMoto} />
            <ConfirmModal title="Confirm Delete" content="This data will be permanently deleted. Do you confirm that?" confirmText="Delete" open={isDeleteMotoOpen} handleClose={() => setIsDeleteMotoOpen(false)} confirmIcon={<DeleteOutline style={{ marginRight: '4px' }} />} handleConfirm={handleDeleteMoto} />
            <CommentButton onClick={handleShowComments}>
                <CommentsIcon />
                Comments
                <CommentsCount>{currentMoto?.comments?.length ?? 0}</CommentsCount>
            </CommentButton>
            <Collapse in={showComments}>
                {CommentsComponent()}
            </Collapse>
        </MotoPane>
    </RootStyle> : <LoadingPane>
        <CircularProgress color="primary" style={{ margin: "auto" }} />
    </LoadingPane>;
}


const LoadingPane = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '50px 0',
}))

const RootStyle = styled('div')(() => ({
    backgroundColor: "#F6FAFD",
    borderRadius: 16,
    border: "1px solid #469AD0",
    padding: 16,
}))

const ToolbarStyle = styled('div')(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}))

const MotoPane = styled('div')(() => ({

}))

const CommentButton = styled(Button)(() => ({
    display: 'flex',
    alignItems: 'center',
    color: "black",
    gap: '4px',
}))

const NewMotoTitle = styled('div')(() => ({
    fontSize: 12,
    fontWeight: 600,
    color: "#469AD0",
    padding: "10px 0",
}))

const MotoTitle = styled('div')(() => ({
    fontSize: 14,
    fontWeight: 600,
    color: "#26282C",
    paddingBottom: "10px",
}))

const MotoDescription = styled('div')(() => ({
    fontSize: 12,
    fontWeight: 400,
    color: "#56605F",
    paddingBottom: "10px",
}))

const WrapperButtonStyle = styled('div')(({ theme }) => ({
    position: 'relative',
    width: '100%',
    margin: "10px auto",
    [theme.breakpoints.up('sm')]: {
        maxWidth: 400,
        minWidth: 320,
    },
}));

const CommentsCount = styled('span')(() => ({
    fontSize: 12,
    fontWeight: 600,
    color: "white",
    width: 22,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#469AD0",
    marginLeft: 4,
    borderRadius: '50%',
}))

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

export default FamilyMotoPane;
