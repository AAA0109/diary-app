import { BaseDomain } from 'core/domain/common/baseDomain';
import { DBUser } from '../users/dbUser';

export class FamilyMotoComment extends BaseDomain {

    
    public id: string | null;

    public userId: string;

    public diaryId: string;

    public comment: string;

    public parentId: string;

    public user: DBUser;

    public createdAt: Date;
}
