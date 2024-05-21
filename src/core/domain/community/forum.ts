import { BaseDomain } from 'core/domain/common/baseDomain';
import { CommunitySubforum } from './subforum';

export class CommunityForum extends BaseDomain {
    /**
     * Comment identifier
     */
    public id?: string | null;

    public title: string;

    public subforums: CommunitySubforum[];
}
