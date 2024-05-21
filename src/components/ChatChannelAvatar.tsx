// hooks
import { Avatar, AvatarGroup } from '@mui/material';

import createAvatar from '../utils/createAvatar';
import { Family } from 'core/domain/family/family';
import { ChatChannel } from 'core/domain/chats/chatChannel';

// ----------------------------------------------------------------------

export default function ChatChannelAvatar({ chatChannel, ...other }: { chatChannel: ChatChannel, [x: string]: any }) {

    return (
        <AvatarGroup max={2}>
            {chatChannel.image ? <Avatar src={chatChannel.image} /> : chatChannel.users?.map((user, index) => <Avatar
                src={`${process.env.REACT_APP_GATEWAY}${user.avatar}`}
                alt={user.fullName}
                color={user.avatar ? 'default' : createAvatar(user.fullName ?? "").color}
                {...other}
            >
                {createAvatar(user.fullName ?? "").name}
            </Avatar>)}
        </AvatarGroup>
    );
}
