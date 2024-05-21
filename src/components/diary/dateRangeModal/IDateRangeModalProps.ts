export interface IDateRangeModalProps {
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

    startDate: Date | null,

    endDate: Date | null,

    handleDateRangeChange: (dateRange: [Date | null, Date | null]) => void,
}
