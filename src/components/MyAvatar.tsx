// hooks
import React from 'react';
import { Avatar } from '@mui/material';
import config from 'config';
import useAuth from '../hooks/useAuth';
//
import createAvatar from '../utils/createAvatar';

// ----------------------------------------------------------------------
const defaultSize = 40;

export default function MyAvatar({ url, size, fontSize, ...other }: any) {
    const user = useAuth().user || { avatar: undefined, fullName: '' };
    return (
        <Avatar
            src={url ?? `${config.gateway.gateway_uri}${user.avatar}`}
            alt={user.fullName}
            sx={{ width: size || defaultSize, height: size || defaultSize, fontSize: fontSize || '16px' }}
            color={user.avatar ? 'default' : createAvatar(user.fullName).color}
            {...other}
        >
            {createAvatar(user.fullName).name}
        </Avatar>
    );
}
