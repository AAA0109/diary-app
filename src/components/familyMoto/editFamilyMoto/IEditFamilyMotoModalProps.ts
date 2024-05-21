import { FamilyMoto } from "core/domain/family/familyMoto";

export interface IEditFamilyMotoModalProps {
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

    moto: FamilyMoto,

    updateCurrentMoto: () => void,
}
