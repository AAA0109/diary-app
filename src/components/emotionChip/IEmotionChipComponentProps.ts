export interface IEmotionChipComponentProps {
    /**
     * Image file name
     */
    emotion?: string;

    /**
     * Image style sheet
     */
    style?: {};

    /**
     * Handle click event
     */
    onDelete?: (event: any) => void;
}
