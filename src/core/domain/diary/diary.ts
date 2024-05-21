import { BaseDomain } from 'core/domain/common/baseDomain';
import { DiaryTopic } from './diaryTopic';
import { DBUser } from '../users/dbUser';
import { DiaryLike } from './diaryLike';
import { DiaryComment } from './diaryComment';

export class Diary extends BaseDomain {
    /**
     * Comment identifier
     */
    public id?: string | null;

    /**
     * Post identifier that comment belong to
     */
    public title?: string;

    public date?: string;

    public diaryTopic?: DiaryTopic;

    public content?: string;

    public user?: DBUser;

    public likes?: DiaryLike[];

    public imageUrl: string;

    public commentCount: number;

    public comments: DiaryComment[];
}
