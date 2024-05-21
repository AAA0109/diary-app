import { BaseDomain } from 'core/domain/common/baseDomain';
import { DBUser } from '../users/dbUser';

export class Family extends BaseDomain {
    /**
     * Comment identifier
     */
    public id: string;

    /**
     * Post identifier that comment belong to
     */

    public name: string;

    public description: string;

    public members?: DBUser[];

    public imgUrl?: string;
}
