import ProfileIcon from '@mui/icons-material/AssignmentIndRounded';
import HomeIcon from '@mui/icons-material/HomeRounded';
import PeopleIcon from '@mui/icons-material/PeopleRounded';
import SettingsIcon from '@mui/icons-material/SettingsRounded';
import HelpIcon from '@mui/icons-material/HelpRounded';
import GroupIcon from '@mui/icons-material/GroupsRounded';
import NotificationIcon from '@mui/icons-material/MessageRounded';
import { PATH_MAIN } from 'routes/paths';

export const menuItems = (socialName: string, translate: (key: string) => string) => [
    {
        label: translate('sidebar.home'),
        path: PATH_MAIN.user.home,
        icon: HomeIcon,
    },
    {
        label: translate('sidebar.people'),
        path: PATH_MAIN.family.home,
        icon: PeopleIcon,
    },
    {
        label: translate('sidebar.community'),
        path: PATH_MAIN.user.community,
        icon: GroupIcon,
    },
    {
        label: translate('sidebar.notification'),
        path: PATH_MAIN.user.community,
        icon: NotificationIcon,
    },
    {
        label: translate('sidebar.profile'),
        path: PATH_MAIN.user.profile.replace(':socialName', socialName),
        icon: ProfileIcon,
    },
    {
        divider: true,
    },
    {
        label: translate('sidebar.account'),
        path: PATH_MAIN.user.account,
        icon: SettingsIcon,
    },
    {
        label: translate('sidebar.support'),
        path: `/support`,
        icon: HelpIcon,
    },
];
