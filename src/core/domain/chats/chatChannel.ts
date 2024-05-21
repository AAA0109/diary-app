import { BaseDomain } from 'core/domain/common/baseDomain';
import { DBUser } from '../users/dbUser';
import { Chat } from './chat';

export class ChatChannel extends BaseDomain {
    /**
     * Comment identifier
     */
    public id: string;

    public name?: string;

    public users?: DBUser[];

    public messages?: Chat[];

    public isGroup: boolean = false;

    public lastMessage?: Chat;

    public unReadCount?: number;

    public image?: string;
}
