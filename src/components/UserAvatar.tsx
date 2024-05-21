// hooks
import React from 'react';
import { Avatar } from '@mui/material';
import { DBUser } from 'core/domain/users/dbUser';

import createAvatar from '../utils/createAvatar';

// ----------------------------------------------------------------------

export default function UserAvatar({ user, ...other }: { user: DBUser, [x: string]: any }) {
    return (
        <Avatar
            src={user.avatar}
            alt={user.fullName}
            color={user.avatar ? 'default' : createAvatar(user.fullName ?? "").color}
            {...other}
        >
            {createAvatar(user.fullName ?? "").name}
        </Avatar>
    );
}
