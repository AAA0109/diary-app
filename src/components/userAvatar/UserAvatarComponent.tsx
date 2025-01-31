import React from 'react';
// material
import Avatar from '@mui/material/Avatar';
// utils
import createAvatar from 'utils/createAvatar';
//
import { IUserAvatarProps } from './IUserAvatarProps';

const defaultSize = 40;
export function UserAvatarComponent(props: IUserAvatarProps) {
    const { src, displayName, size, ...other } = props;
    console.log(createAvatar(displayName || '').color);
    return (
        <Avatar
            src={src}
            alt={displayName}
            sx={{ width: size || defaultSize, height: size || defaultSize }}
            color={src ? 'warning' : createAvatar(displayName || '').color}
            {...other}
        >
            {createAvatar(displayName || '').name}
        </Avatar>
    );
}
export default UserAvatarComponent;
