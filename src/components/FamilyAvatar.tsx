// hooks
import { ModeOutlined } from '@mui/icons-material';
import { Avatar, Box, styled } from '@mui/material';

import { Family } from 'core/domain/family/family';

// ----------------------------------------------------------------------

export default function FamilyAvatar({ family, ...other }: { family: Family, [x: string]: any }) {
    return (
        <FamilyAvatarRoot position='relative'>
            <Avatar
                src={family.imgUrl ?? "https://cdn-icons-png.flaticon.com/512/7051/7051035.png"}
                alt={family.name}
                color='default'
                {...other}
            />
            {/* <EditIcon /> */}
        </FamilyAvatarRoot>
    );
}

const FamilyAvatarRoot = styled(Box)(() => ({
    position: 'relative',
    // backgroundColor: '#eee',
    borderRadius: '50%',
    padding: '4px',
}));

const EditIcon = styled(ModeOutlined)(() => ({
    position: 'absolute',
    bottom: '4px',
    right: '4px',
    color: '#333',
}));

