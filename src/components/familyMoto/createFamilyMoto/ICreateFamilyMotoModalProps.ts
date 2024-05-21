import { FamilyMoto } from "core/domain/family/familyMoto";

export interface ICreateFamilyMotoModalProps {
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

    updateCurrentMoto: () => void,
}
