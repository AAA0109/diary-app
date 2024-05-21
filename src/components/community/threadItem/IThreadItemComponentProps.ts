import { CommunityThread } from "core/domain/community/thread";
import { Diary } from "core/domain/diary/diary";

export interface IThreadItemComponentProps {
    /**
     * Image file name
     */
    thread: CommunityThread;

    /**
     * Image style sheet
     */
    style?: {};

    /**
     * Handle click event
     */
    onClick?: (event: any) => void;

    updateThreadList?: () => Promise<void>,

    updateThread?: () => Promise<void>,
}
