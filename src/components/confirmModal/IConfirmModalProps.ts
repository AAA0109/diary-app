export interface IConfirmModalProps {
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
    
    handleConfirm: () => Promise<boolean>,

    title?: string,
    content?: string,
    confirmText?: string,
    cancelText?: string,
    confirmIcon?: any,
    confirmColor?: any,
}
