import { User } from "core/domain/users/user";

export interface IEnterFamilyModalProps {
    /**
     * Image file name
     */
    /**
     * Image style sheet
     */
    style?: {};

    /**
     * Handle click event
     */
    handleClose: () => void;

    open: boolean,

    user: User
}
