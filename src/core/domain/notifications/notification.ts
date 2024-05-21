import { BaseDomain } from 'core/domain/common/baseDomain';
import { User } from 'core/domain/users/user';
import { NotificationType } from 'core/domain/notifications/notificationType';

export class Notification extends BaseDomain {
    /**
     * Notification identifier
     */
    public id?: string;

    /**
     * Description of notification
     */
    public content: string;

    public title?: string;

    /**
     * The URL which notification refer to
     */
    public url: string;

    /**
     * Creation date
     */
    public createdAt: number;

    /**
     * The identifier of the user who makes the notification
     */
    public userId: number;

    /**
     * If the notification is seen {true} or not {false}
     */
    public isRead: boolean;

    /**
     * Notification type
     */
    public type: NotificationType;
}
