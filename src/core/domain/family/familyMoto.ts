import { BaseDomain } from 'core/domain/common/baseDomain';
import { DBUser } from '../users/dbUser';
import { FamilyMotoComment } from './fanilyMotoComment';

export class FamilyMoto extends BaseDomain {
    /**
     * Comment identifier
     */
    public id: string;

    /**
     * Post identifier that comment belong to
     */

    public name: string;

    public description: string;

    public familyId: string;

    public archived: boolean;

    public comments: FamilyMotoComment[];

    public createdAt: number;
}
