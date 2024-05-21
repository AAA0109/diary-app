import { BaseDomain } from 'core/domain/common/baseDomain';
import { DBUser } from '../users/dbUser';

export class Chat extends BaseDomain {
    /**
     * Comment identifier
     */
    public id?: string | null;

    public content?: string;

    public createdAt?: number;

    public fromId?: string;

    public toId?: string;

    public type: string = 'text';

    public link?: string;

    public isGroup: boolean = false;

    public isSent: boolean = false;

    public seen: boolean = false;

    public isUploading: boolean = false;
}
