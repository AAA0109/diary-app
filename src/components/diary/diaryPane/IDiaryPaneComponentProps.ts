import { Diary } from "core/domain/diary/diary";

export interface IDiaryPaneComponentProps {
    /**
     * Image file name
     */
    diary: Diary;

    /**
     * Image style sheet
     */
    style?: {};

    /**
     * Handle click event
     */
    onClick?: (event: any) => void;

    updateDiaryList: () => Promise<void>,

    updateDiary?: () => Promise<void>,

    isFixedSize?: boolean,

    isExpand?: boolean,

    canExpand?: boolean,

    showComments?: boolean,

    isCarrousel?: boolean,
}
