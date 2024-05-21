import { BaseDomain } from 'core/domain/common/baseDomain';
import { DiaryTopic } from './diaryTopic';
import { DBUser } from '../users/dbUser';

export class DiaryLike extends BaseDomain {
    /**
     * Comment identifier
     */
    public id: string | null;

    public userId: string;

    public diaryId: string;
}
