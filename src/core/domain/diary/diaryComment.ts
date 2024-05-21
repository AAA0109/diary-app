import { BaseDomain } from 'core/domain/common/baseDomain';
import { DiaryTopic } from './diaryTopic';
import { DBUser } from '../users/dbUser';
import { User } from '../users/user';

export class DiaryComment extends BaseDomain {
    /**
     * Comment identifier
     */
    public id: string | null;

    public userId: string;

    public diaryId: string;

    public comment: string;

    public parentId: string;

    public user: DBUser;

    public createdAt: Date;
}
