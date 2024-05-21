export interface IFilterDiariesModalProps {
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

    sortBy: string,
    topicFilter: string,
    applyFilter: (sortBy: string, topicFilter: string) => void,
}
