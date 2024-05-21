import { BaseDomain } from 'core/domain/common/baseDomain';
import { CommunityThread } from './thread';
import { DBUser } from '../users/dbUser';
import { User } from '../users/user';

export class ThreadComment extends BaseDomain {
    /**
     * Comment identifier
     */
    public id: string | null;

    public userId: string;

    public threadId: string;

    public comment: string;

    public parentId: string;

    public user: DBUser;

    public createdAt: Date;
}
