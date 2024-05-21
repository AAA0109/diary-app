import { BaseDomain } from 'core/domain/common/baseDomain';

export class DiaryTopic extends BaseDomain {
    /**
     * Comment identifier
     */
    public id?: string | null;

    /**
     * Post identifier that comment belong to
     */
    public name?: string;

    public description?: string;

    public imgUrl?: string;

}
