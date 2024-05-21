import { BaseDomain } from 'core/domain/common/baseDomain';
import { CommunityThread } from './thread';
import { DBUser } from '../users/dbUser';

export class ThreadLike extends BaseDomain {
    /**
     * Comment identifier
     */
    public id: string | null;

    public userId: string;

    public threadId: string;
}
