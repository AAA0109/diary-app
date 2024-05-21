import { BaseDomain } from 'core/domain/common/baseDomain';
import { DBUser } from '../users/dbUser';
import { DiaryLike } from '../diary/diaryLike';
import { ThreadComment } from './threadComment';
import { ThreadLike } from './threadLike';
import { CommunityForum } from './forum';

export class CommunityThread extends BaseDomain {
    /**
     * Comment identifier
     */
    public id?: string | null;

    /**
     * Post identifier that comment belong to
     */
    public title?: string;

    public content?: string;

    public link?: string;

    public filename?: string;

    public user?: DBUser;

    public subforumId?: number;

    public subforum?: CommunityForum;

    public createdAt?: number;

    public likes?: ThreadLike[];

    public comments?: ThreadComment[];
}
