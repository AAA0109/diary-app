import { Family } from "core/domain/family/family";
import { User } from "core/domain/users/user";

export interface IAddMemberModalProps {
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

    family: Family
}
