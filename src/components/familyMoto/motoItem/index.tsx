import React, { useEffect, useState } from "react";
import { CloseOutlined, DeleteOutline, MoreHoriz } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Collapse, IconButton, InputAdornment, Menu, MenuItem, TextField, Typography, styled } from "@mui/material";
import useAuth from "hooks/useAuth";
import { FamilyMoto } from "core/domain/family/familyMoto";
import CommentsIcon from "components/icons/CommentsIcon";
import { FamilyMotoComment } from "core/domain/family/fanilyMotoComment";
import UserAvatar from "components/UserAvatar";
import { hummanizeDateDiff } from "utils/global";
import { useSnackbar } from "notistack";
import ConfirmModal from "components/confirmModal";
import moment from "moment";
import GraphIcon from "components/icons/GraphIcon";
import ArchieveIcon from "components/icons/ArchieveIcon";

export function FamilyMotoItem({ ...props }) {

    const [mottoMenuAnchorEl, setMottoMenuAnchorEl] = useState<null | HTMLElement>(null);
    const mottoMenuOpen = Boolean(mottoMenuAnchorEl);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const { deleteFamilyMoto } = useAuth();
    const [isDeleteMotoOpen, setIsDeleteMotoOpen] = useState(false);
    const [showComments, setShowComments] = useState(false);

    const currentMoto = props.moto as FamilyMoto;

    const handleMottoMoreClick = (event: React.MouseEvent<HTMLElement>) => {
        setMottoMenuAnchorEl(event.currentTarget);
    };

    const handleMottoMenuClose = () => {
        setMottoMenuAnchorEl(null);
    };

    const updateCurrentMoto = () => {
        props.updateMotos();
    }

    const CommentsComponent = () => {
        return (
            <Box my="12px" bgcolor='white' padding='0 12px' borderRadius='8px'>
                <Box mb="12px">
                    {currentMoto?.comments?.filter(e => !e.parentId).sort((a, b) => a.createdAt > b.createdAt ? 1 : -1).map((comment, index) => (
                        CommentComponent(comment, `${index}`)
                    ))}
                    {!currentMoto?.comments?.length && <NoCommentsText>No comments here...</NoCommentsText>}
                </Box>
            </Box>
        );
    }

    const CommentComponent = (comment: FamilyMotoComment, index: string) => {
        const replies = currentMoto?.comments?.filter(e => e.parentId === comment.id);
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
                    <Typography fontWeight="600" fontSize="14px">
                        {hummanizeDateDiff(comment.createdAt, new Date())} ago
                    </Typography>
                </CommentToolbox>
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

    const handleConfirmDelete = () => {
        setIsDeleteMotoOpen(true);
        handleMottoMenuClose();
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
        updateCurrentMoto();
        return true;
    }

    return (
        <RootStyle>
            <MotoTime>
                {moment(currentMoto?.createdAt).format('MMMM DDD YYYY hh:mm a')}
            </MotoTime>
            <BodyStyle>
                <ToolbarStyle>
                    <Box display='flex' gap='12px' alignItems='center'>
                        <GraphIcon />
                        <MotoTitle>
                            {currentMoto?.name}
                        </MotoTitle>
                    </Box>
                    {props.canEdit && <Box>
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
                            <MenuItem onClick={handleConfirmDelete} style={{ color: 'rgb(239, 71, 111)' }}>
                                Remove
                            </MenuItem>
                        </Menu>
                    </Box>}
                </ToolbarStyle>
                <MotoPane>
                    {currentMoto && <MotoDescription>
                        {currentMoto.description}
                    </MotoDescription>}
                    <ConfirmModal title="Confirm Delete" content="This data will be permanently deleted. Do you confirm that?" confirmText="Delete" open={isDeleteMotoOpen} handleClose={() => setIsDeleteMotoOpen(false)} confirmIcon={<DeleteOutline style={{ marginRight: '4px' }} />} handleConfirm={handleDeleteMoto} />
                    <Box display='flex' alignContent={'center'} justifyContent={'space-between'}>
                        <ArchiveBox>
                            <ArchieveIcon color={currentMoto?.archived ? '#27AE60' : '#F2698A'} />
                            {currentMoto?.archived ? 'Archieved' : 'Reward Unachieved'}
                        </ArchiveBox>
                        <CommentButton onClick={handleShowComments}>
                            <CommentsIcon />
                            Comments
                            <CommentsCount>{currentMoto?.comments?.length ?? 0}</CommentsCount>
                        </CommentButton>
                    </Box>
                    <Collapse in={showComments}>
                        {CommentsComponent()}
                    </Collapse>
                </MotoPane>
            </BodyStyle>
        </RootStyle>
    );
}

const BodyStyle = styled('div')(() => ({
    backgroundColor: "white",
    borderRadius: 16,
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 10px 0px',
    padding: 16,
}))

const RootStyle = styled('div')(() => ({
    padding: 8,
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

const MotoTitle = styled('div')(() => ({
    fontSize: 16,
    fontWeight: 600,
    color: "#26282C",
}))

const MotoDescription = styled('div')(() => ({
    fontSize: 12,
    fontWeight: 400,
    color: "#56605F",
    padding: "10px 0",
}))

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
}))

const ReplyComponent = styled(Box)(({ theme }) => ({
    marginLeft: '16px',
    borderLeft: '1px solid #E0E0E0',
    paddingLeft: '12px',
    marginBottom: '6px',
    marginTop: '6px',
}))

const MotoTime = styled(Typography)(({ theme }) => ({
    fontSize: 12,
    fontWeight: 400,
    color: "#56605F",
    padding: "10px",
}))

const ArchiveBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: 12,
    fontWeight: 500,
    color: "#56605F",
}))

const NoCommentsText = styled(Typography)(({ theme }) => ({
    fontSize: 14,
    fontWeight: 400,
    color: "#56605F",
    padding: "10px",
    textAlign: 'center',
}))

export default FamilyMotoItem;
