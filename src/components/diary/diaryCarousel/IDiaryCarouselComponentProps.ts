import { Diary } from "core/domain/diary/diary";

export interface IDiaryCarouselComponentProps {
    /**
     * Image file name
     */
    diaryList: Diary[];

    /**
     * Image style sheet
     */
    style?: {};

    updateDiaryList: () => Promise<void>,

}
