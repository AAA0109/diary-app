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
import { EmotionList } from "constants/emtionList";
import { useNavigate } from "react-router";
import { PATH_MAIN } from "routes/paths";

export function FamilyMemberItem({ ...props }) {
    const navigate = useNavigate();

    const member = props.member;

    const [mottoMenuAnchorEl, setMottoMenuAnchorEl] = useState<null | HTMLElement>(null);
    const mottoMenuOpen = Boolean(mottoMenuAnchorEl);

    const handleMottoMoreClick = (event: React.MouseEvent<HTMLElement>) => {
        setMottoMenuAnchorEl(event.currentTarget);
    };

    const handleMottoMenuClose = () => {
        setMottoMenuAnchorEl(null);
    };

    const goToFamilyDiaries = (userId: number) => {
        navigate(PATH_MAIN.family.diaries(userId.toString()));
    }

    const goToMessagePage = (userId: number) => {
        navigate(PATH_MAIN.chats.chat(userId.toString(), false));
    }

    return (
        <FamilyMemberPane>
            <Box display='flex' alignItems='center' gap='12px'>
                <UserAvatar user={member} sx={{ width: 40, height: 40 }} />
                <Box>
                    <UserRoleText color={member.guardianId ? '#469AD0' : '#EF8E47'}>{member.customName ?? (member.guardianId ? 'Child' : 'Parent')}</UserRoleText>
                    <UserNameText>{member.fullName}</UserNameText>
                    <MemberEmotion>{EmotionList.find((emotion) => emotion.key === member?.currentEmotion!)?.text}</MemberEmotion>
                </Box>
            </Box>
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
                    <MenuItem onClick={() => goToFamilyDiaries(member.id!)}>
                        View Diaries
                    </MenuItem>
                    <MenuItem onClick={() => goToMessagePage(member.id!)}>
                        Message
                    </MenuItem>
                </Menu>
            </Box>
        </FamilyMemberPane>
    );
}

const FamilyMemberPane = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    filter: 'drop-shadow(0px 4px 20px rgba(184, 184, 184, 0.15))',
    borderRadius: 12,
    padding: 12,
    margin: "10px 0",
}))

const UserRoleText = styled(Typography)(() => ({
    fontSize: 12,
    fontWeight: 500,
}))

const UserNameText = styled(Typography)(() => ({
    fontSize: 14,
    fontWeight: 600,
    color: "#26282C",
}))

const MemberEmotion = styled(Typography)(() => ({
    fontSize: '12px',
    fontWeight: 400,
    color: '#797C7B',
    textAlign: 'left',
}))

export default FamilyMemberItem;
