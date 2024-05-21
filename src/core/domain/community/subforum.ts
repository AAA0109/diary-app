import { BaseDomain } from 'core/domain/common/baseDomain';
import { CommunityForum } from './forum';
import { CommunityThread } from './thread';

export class CommunitySubforum extends BaseDomain {
    /**
     * Comment identifier
     */
    public id?: string | null;

    public title: string;

    public description: string;

    public forum?: CommunityForum;

    public threads?: CommunityThread[];
}
