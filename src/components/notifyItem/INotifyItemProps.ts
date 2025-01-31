export interface INotifyItemProps {
    /**
     * Notification description
     *
     * @type {string}
     * @memberof INotifyItemProps
     */
    description: string;

    /**
     * User full name
     *
     * @type {string}
     * @memberof INotifyItemProps
     */
    fullName: string;

    /**
     * User avatar
     *
     * @type {string}
     * @memberof INotifyItemProps
     */
    avatar: string;

    /**
     * Notification has seen {true} or not {false}
     *
     * @type {boolean}
     * @memberof INotifyItemProps
     */
    isRead: boolean;

    /**
     * Notification identifier
     *
     * @type {string}
     * @memberof INotifyItemProps
     */
    id: string;

    /**
     * Close a notification
     *
     * @memberof INotifyItemProps
     */
    closeNotify: () => void;

    /**
     * Notifier identifier
     *
     * @type {string}
     * @memberof INotifyItemProps
     */
    userId: string;

    /**
     * The URL which notification mention
     *
     * @type {string}
     * @memberof INotifyItemProps
     */
    url: string;

    /**
     * Delete a notification
     *
     * @memberof INotifyItemProps
     */
    deleteNotify: (notificationId: string) => any;

    /**
     * Change notification status to has seen
     *
     * @memberof INotifyItemProps
     */
    seenNotify: (notificationId: string) => any;
}
